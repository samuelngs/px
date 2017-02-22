
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

export default class ImageActionBar extends Component {

  render() {
    return <View style={styles.base}>
    </View>
  }

}

const styles = StyleSheet.create({
  base: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
