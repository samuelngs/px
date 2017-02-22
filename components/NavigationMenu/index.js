
import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';

import source from 'px/assets/icons/menu_705120.png';

export default class NavigationMenu extends Component {

  setNativeProps(props) {
    this.node && this.node.setNativeProps(props);
  }

  render() {
    return <Image style={styles.base} ref={n => this.node = n} source={source} />
  }

}

const styles = StyleSheet.create({
  base: {
    marginLeft: 5,
    height: 34,
    width: 34,
    backgroundColor: 'transparent',
  },
});

