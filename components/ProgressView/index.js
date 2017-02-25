
import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

export default class ProgressView extends Component {

  static defaultProps = {
    style: {},
  }

  static propTypes = {
    style: React.PropTypes.object,
  }

  render() {
    const { style } = this.props;
    return <View style={[styles.base, style]}>
      <ActivityIndicator style={styles.indicator} />
    </View>
  }

}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  indicator: {
    width: 20,
    height: 20,
  },
});

