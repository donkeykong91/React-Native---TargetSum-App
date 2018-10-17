import React from 'react';

import { View, Text, StyleSheet } from 'react-native'

import PropTypes from 'prop-types';

import RandomNumber from './RandomNumber';

import shuffle from "lodash.shuffle";


class Game extends React.Component {

  static propTypes = {

    randomNumberCount: PropTypes.number.isRequired,

    initialSeconds: PropTypes.number.isRequired,

  };


  state = {

    selectedIds: [],

    remainingSeconds: this.props.initialSeconds,

  }


  randomNumbers = Array.from({ length: this.props.randomNumberCount })

                      .map(function () {

                        return 1 + Math.floor(10 * Math.random());

                      });


  target = this.randomNumbers

            .slice(0, this.props.randomNumberCount - 2)

            .reduce(function (accumulator, current) {

              return accumulator + current;

            }, 0);


  gameStatus = "PLAYING";


  forcedUpdate = false;


  shuffledRandomNumbers = shuffle(this.randomNumbers);


  componentDidMount() {

    this.intervalId = setInterval(() => {

      this.setState(function (prevState) {

        return {

          remainingSeconds: prevState.remainingSeconds - 1

        };

      }, () => {

        if (this.state.remainingSeconds === 0) {

          clearInterval(this.intervalId);

        }

      });

    }, 1000);

  }


  getSnapshotBeforeUpdate(previousProps, previousState) {

    if (previousState.selectedIds !== this.state.selectedIds ||
        this.state.remainingSeconds === 0) {

      this.gameStatus = this.calcGameStatus();

      return this.gameStatus;

    }

    return null;

  }


  componentDidUpdate(snapShot) {

    if (this.gameStatus !== "PLAYING" && !this.forcedUpdate) {

      this.forcedUpdate = true;

      clearInterval(this.intervalId);

      this.forceUpdate();

    } else if (!snapShot) {

      return;

    }

  }


  componentWillUnmount() {

    clearInterval(this.intervalId);

  }


  isNumberSelected = (numberIndex) => {

    return this.state.selectedIds.indexOf(numberIndex) >= 0;

  }


  selectNumber = (numberIndex) => {

    this.setState((prevState) => {

      return {

        selectedIds: [

          ...prevState.selectedIds,

          numberIndex

        ]

      };

    });

  }


  calcGameStatus = () => {

    console.log("calcGameStatus");

    const sumSelected = this.state.selectedIds.reduce((accumulator, current) => {

      return accumulator + this.shuffledRandomNumbers[current];

    }, 0);

    if (this.state.remainingSeconds === 0) {

      return "LOST";

    }

    if (sumSelected < this.target) {

      return "PLAYING";

    }

    if (sumSelected === this.target) {

      return "WON";

    }

    if (sumSelected > this.target) {

      return "LOST";

    }

  };


  render() {

    const gameStatus = this.gameStatus;

    return (

      <View style={styles.container}>

        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>

          {this.target}

        </Text>

        <View style={styles.randomContainer}>

          {this.shuffledRandomNumbers.map( (randomNumber, index) => {

            return (

                <RandomNumber

                  key={index}

                  id={index}

                  number={randomNumber}

                  isDisabled={this.isNumberSelected(index) || gameStatus !== "PLAYING"}

                  onPress={this.selectNumber}

                />

            );

          })}

        </View>

        <Text>{this.state.remainingSeconds}</Text>

      </View>

    );

  }

}


const styles = StyleSheet.create({

  container: {

    backgroundColor: "#ddd",

    flex: 1,

    paddingTop: 30,

  },

  target: {

    fontSize: 50,

    marginHorizontal: 50,

    textAlign: "center",

  },

  randomContainer: {

    flex: 1,

    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-around',

  },

  random: {

    backgroundColor: '#999',

    width: 100,

    marginHorizontal: 15,

    marginVertical: 25,

    fontSize: 35,

    textAlign: 'center',

  },

  STATUS_PLAYING: {

    backgroundColor: "#bbb",

  },

  STATUS_WON: {

    backgroundColor: "green",

  },

  STATUS_LOST: {

    backgroundColor: "red",

  },

});


export default Game;
