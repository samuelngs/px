
import React, { Component } from 'react';
import { Animated } from 'react-native';

export default class ParallaxHeader extends Component {

  static defaultProps = {
    height: 300,
    animate: null,
  }

  static propTypes = {
    height: React.PropTypes.number,
    animate: React.PropTypes.object,
  }

  setNativeProps(props) {
    this.node && this.node.setNativeProps(props);
  }

  render() {
    const { children, height, animate } = this.props;
    return <Animated.View
      ref={n => this.node = n}
      style={{
        position: 'absolute',
        height: height,
        transform: [{
          translateY: animate.interpolate({
            inputRange: [ -height, 0, height],
            outputRange: [height/2, 0, -height/3]
          })
        },{
          scale: animate.interpolate({
            inputRange: [ -height, 0, height],
            outputRange: [2, 1, 1]
          })
        }]
      }}
    >
      { React.Children.only(children) }
    </Animated.View>
  }

}


