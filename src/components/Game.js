import React from 'react';

import { View, Text, StyleSheet } from 'react-native'

import PropTypes from 'prop-types';


class Game extends React.Component {

  static propTypes = {

    randomNumberCount: PropTypes.number.isRequired,

  };


  randomNumbers = Array.from({ length: this.props.randomNumberCount })

                      .map(function () {

                        return 1 + Math.floor(10 * Math.random());

                      });

  target = this.randomNumbers

            .slice(0, this.props.randomNumberCount - 2)

            .reduce(function (accumulator, current) {

              return accumulator + current;

            }, 0);


  render() {

    return (

      <View style={styles.container}>

        <Text style={styles.target}>

          {this.target}

        </Text>

        {this.randomNumbers.map(function (randomNumber, index) {

          return (

            <Text key={index}>

              {randomNumber}

            </Text>

          );

        })}

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

    fontSize: 40,

    backgroundColor: "#aaa",

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

    marginHorizontal: 15

  }

});


export default Game;
