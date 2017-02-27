
import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, PanResponder } from 'react-native';

export default class ParallaxContainer extends Component {

  static defaultProps = {
    height: 300,
    backgroundColor: '#fff',
    dimensions: {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    },
    onPress: () => null,
  }

  static propTypes = {
    height: React.PropTypes.number,
    backgroundColor: React.PropTypes.string,
    dimensions: React.PropTypes.shape({
      height: React.PropTypes.number,
      width: React.PropTypes.number,
    }),
    onPress: React.PropTypes.func,
  }

  componentWillMount() {
    const { onPress } = this.props;
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onShouldBlockNativeResponder: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => true,
      onPanResponderTerminate: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => onPress(evt),
    });
  }

  render() {
    const { children, height: headerHeight, backgroundColor, dimensions } = this.props;
    return <View style={styles.base}>
      <View style={{ height: headerHeight }} { ...this._panResponder.panHandlers } />
      <View style={{ backgroundColor, minHeight: dimensions.height - headerHeight }}>
        { React.Children.only(children) }
      </View>
    </View>
  }

}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});
