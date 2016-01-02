/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');

var SwitchAndroid = require('SwitchAndroid'); 
// var Text = require('Text'); 
// var UIExplorerBlock = require('UIExplorerBlock'); 
// var UIExplorerPage = require('UIExplorerPage');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var HomeRemote = React.createClass({

  getInitialState : function() {
    return { 
      falseSwitchIsOn: false
    };
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <SwitchAndroid onValueChange={(value) => this.setState({falseSwitchIsOn: value})} style={{marginBottom: 10}} value={this.state.falseSwitchIsOn} />
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Shake or press menu button for dev menu
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('HomeRemote', () => HomeRemote);
