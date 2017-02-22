
import React, { Component } from 'react';
import { Animated, View, InteractionManager } from 'react-native';

import { LazyloadView } from 'react-native-lazyload';

export default class ProgressiveImage extends Component {

  static defaultProps = {
    host      : '',
    bg        : 'transparent',
    source    : '',
    resizeMode: 'cover',
    style     : { },
  }

  static propTypes = {
    host      : React.PropTypes.string,
    bg        : React.PropTypes.string,
    source    : React.PropTypes.string,
    resizeMode: React.PropTypes.string,
    style     : React.PropTypes.object,
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
    const { host, bg, resizeMode, source, style } = this.props;
    const { opacity } = this.state;
    const Wrapper = host ? LazyloadView : View;
    return <Wrapper host={host} ref={n => this.node = n} style={[style, { backgroundColor: bg }]}>
      <Animated.Image
        resizeMode={resizeMode}
        style={[style, { opacity }]}
        source={{uri: source}}
        onLoad={this.onLoad}
      />
    </Wrapper>
  }

}

