
import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import source from 'px/assets/logo/Icon-60.png';

export default class NavigationLogo extends Component {

  setNativeProps(props) {
    this.node && this.node.setNativeProps(props);
  }

  render() {
    return <View style={styles.base} ref={n => this.node = n}>
      <Image style={styles.image} source={source} />
    </View>
  }

}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    height: 42,
    width: 42,
  },
});

