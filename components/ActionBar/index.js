
import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, InteractionManager } from 'react-native';

export default class ActionBar extends Component {

  static defaultProps = {
    style: { },
    left: null,
    right: null,
    center: null,
  }

  static propTypes = {
    style: React.PropTypes.object,
    left: React.PropTypes.element,
    right: React.PropTypes.element,
    center: React.PropTypes.element,
  }

  state = {
    dimensions: {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    },
  }

  componentLayoutUpdate(e) {
    InteractionManager.runAfterInteractions(() => {
      const { height, width } = Dimensions.get('window');
      const dimensions = {
        height,
        width,
      };
      return this.setState({
        dimensions,
      });
    });
  }

  render() {
    const { style, left, right, center } = this.props;
    const { dimensions: { width } } = this.state;
    return <View style={[styles.container, style.position === 'absolute' && { width }, style]} onLayout={(e) => this.componentLayoutUpdate(e)}>
      <View style={[styles.column, styles.left]}>{ left }</View>
      <View style={[styles.column, styles.center]}>{ center }</View>
      <View style={[styles.column, styles.right]}>{ right }</View>
    </View>
  }

}

const styles = StyleSheet.create({
  container: {
    height: 46,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 14,
    paddingRight: 14,
  },
  left: {
    alignItems: 'flex-start',
  },
  right: {
    alignItems: 'flex-end',
  },
  center: {
    alignItems: 'center',
  },
});

