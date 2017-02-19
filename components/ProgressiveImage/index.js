
import React, { Component } from 'react';
import { Animated, View, InteractionManager } from 'react-native';

import { LazyloadView } from 'react-native-lazyload';

export default class ProgressiveImage extends Component {

  static defaultProps = {
    host  : '',
    width : 200,
    height: 200,
    radius: 0,
    bg    : '#fff',
    uri   : '',
    style : { },
  }

  static propTypes = {
    host  : React.PropTypes.string,
    width : React.PropTypes.number,
    height: React.PropTypes.number,
    radius: React.PropTypes.number,
    bg    : React.PropTypes.string,
    uri   : React.PropTypes.string,
    style : React.PropTypes.object,
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
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 250,
      }).start();
    });
  }

  render() {
    const { host, width, height, radius: borderRadius, bg: backgroundColor, uri, style } = this.props;
    const { opacity } = this.state;
    const Wrapper = host ? LazyloadView : View;
    return <Wrapper host={host} ref={n => this.node = n} style={[{ width, height, borderRadius, backgroundColor }, style]}>
      <Animated.Image
        resizeMode="cover"
        style={[{ opacity, width, height, borderRadius }, style]}
        source={{ uri }}
        onLoad={ this.onLoad }
      />
    </Wrapper>
  }

}

