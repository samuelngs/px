
import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';

import source from 'px/assets/icons/search_857956.png';

export default class NavigationSearch extends Component {

  setNativeProps(props) {
    this.node && this.node.setNativeProps(props);
  }

  render() {
    return <Image style={styles.base} ref={n => this.node = n} source={source} />
  }

}

const styles = StyleSheet.create({
  base: {
    marginRight: -5,
    height: 32,
    width: 32,
    backgroundColor: 'transparent',
  },
});

