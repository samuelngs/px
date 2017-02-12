
import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';

import source from 'px/assets/logo/Icon-60.png';

export default class NavigationLogo extends Component {

  setNativeProps(props) {
    this.node && this.node.setNativeProps(props);
  }

  render() {
    return <Image style={styles.base} ref={n => this.node = n} source={source} />
  }

}

const styles = StyleSheet.create({
  base: {
    height: 42,
    width: 42,
    backgroundColor: 'transparent',
  },
});

