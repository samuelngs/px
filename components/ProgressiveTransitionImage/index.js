
import React, { Component } from 'react';
import { Animated, View, InteractionManager } from 'react-native';

import TransitionImage from 'px/components/TransitionImage';

export default class ProgressiveTransitionImage extends Component {

  static defaultProps = {
    ...TransitionImage.defaultProps,
    wrapper       : View,
    options       : { },
    containerStyle: null,
  }

  static propTypes = {
    ...TransitionImage.propTypes,
    wrapper       : React.PropTypes.func,
    options       : React.PropTypes.object,
    containerStyle: React.PropTypes.object,
  }

  state = {
    opacity: new Animated.Value(0),
  }

  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
  }

  setNativeProps(props) {
    this.node && this.node.setNativeProps(props);
  }

  onLoad() {
    InteractionManager.runAfterInteractions(() => {
      const { onLoad } = this.props;
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 250,
      }).start(() => {
        typeof onLoad === 'function' && onLoad.call(this);
      });
    });
  }

  render() {
    const { wrapper: Wrapper, options, containerStyle, ...props } = this.props;
    const { opacity } = this.state;
    return <Wrapper { ...options } ref={n => this.node = n} style={containerStyle}>
      <Animated.View style={{ opacity }}>
        <TransitionImage { ...props } onLoad={this.onLoad} />
      </Animated.View>
    </Wrapper>
  }

}


