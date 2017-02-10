
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

export default class Home extends Component {

  static defaultProps = {

  }

  static propTypes = {
  }

  onLeftButtonPressed() {
    console.log('Home left button pressed');
  }

  onRightButtonPressed() {
    console.log('Home right button pressed');
  }

  onPush() {
    const { navigator } = this.props;
    navigator.push('photo');
  }

  render() {
    return <View style={styles.container}>
      <TouchableHighlight onPress={() => this.onPush()}>
        <Text>Home UI</Text>
      </TouchableHighlight>
    </View>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

