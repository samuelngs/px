
import React, { Component } from 'react';
import { Animated, View, StyleSheet, Dimensions, InteractionManager } from 'react-native';

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

  setNativeProps(props) {
    this.node && this.node.setNativeProps(props);
  }

  componentDidMount() {
    this._mount = true;
  }

  componentWillUnmount() {
    this._mount = false;
  }

  componentLayoutUpdate(e) {
    InteractionManager.runAfterInteractions(() => {
      if ( !this._mount ) return;
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
    return <Animated.View ref={n => this.node = n} style={[styles.container, { width }, style]} onLayout={(e) => this.componentLayoutUpdate(e)}>
      <View style={[styles.column, styles.left]}>{ left }</View>
      <View style={[styles.column, styles.center]}>{ center }</View>
      <View style={[styles.column, styles.right]}>{ right }</View>
    </Animated.View>
  }

}

const styles = StyleSheet.create({
  container: {
    height: 46,
    backgroundColor: '#fff',
    shadowRadius: .5,
    shadowOpacity: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    zIndex: 20,
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

