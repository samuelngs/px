
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

export default class Photo extends Component {

  static defaultProps = {
  }

  static propTypes = {
  }

  onBack() {
    const { navigator } = this.props;
    return navigator.pop();
  }

  render() {
    return <View style={styles.container}>
      <TouchableHighlight onPress={() => this.onBack()}>
        <Text>Photo UI</Text>
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


