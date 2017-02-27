
import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';

import Touchable from 'px/components/Touchable';
import source from 'px/assets/icons/navigation_back.png';

export default class NavigationBack extends Component {

  static defaultProps = {
    navigation: null,
  }

  static propTypes = {
    navigation: React.PropTypes.object,
  }

  setNativeProps(props) {
    this.node && this.node.setNativeProps(props);
  }

  render() {
    const { navigation: { goBack } } = this.props;
    return <Touchable onPress={() => goBack(null)}>
      <Image style={styles.base} ref={n => this.node = n} source={source} />
    </Touchable>
  }

}

const styles = StyleSheet.create({
  base: {
    marginLeft: 10,
    height: 18,
    width: 18,
  },
  image: {
    height: 18,
    width: 18,
    backgroundColor: 'transparent',
  },
});

