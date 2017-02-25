
import React, { Component } from 'react';
import { Animated, View, StyleSheet, InteractionManager } from 'react-native';

import Touchable from 'px/components/Touchable';

export default class Tab extends Component {

  static defaultProps = {
    id: '',
    inactiveOpacity: .5,
    inactiveColor: '#aaa',
    activeOpacity: 1,
    activeColor: '#000',
    isActive: false,
    separator: false,
    separatorWidth: 18,
    onLayout: () => { },
    onPress: () => { },
  }

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    inactiveOpacity: React.PropTypes.number,
    inactiveColor: React.PropTypes.string,
    activeOpacity: React.PropTypes.number,
    activeColor: React.PropTypes.string,
    isActive: React.PropTypes.bool,
    separator: React.PropTypes.bool,
    separatorWidth: React.PropTypes.number,
    onLayout: React.PropTypes.func,
    onPress: React.PropTypes.func,
  }

  state = {
    animate: new Animated.Value(this.props.isActive ? 1 : 0),
  }

  componentDidMount() {
    const { id } = this.props;
    if ( !id ) {
      throw 'Tab requires an unique id attribute';
    }
  }

  componentDidUpdate({ isActive: prevIsActive }) {
    const { isActive } = this.props;
    if ( prevIsActive !== isActive ) {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(_ => {
          Animated.timing(
            this.state.animate,
            {
              toValue: isActive ? 1 : 0,
              duration: 250,
            }
          ).start();
        }, 250);
      });
    }
  }

  renderChildren() {
    const {
      animate,
    } = this.state;
    const {
      children,
      id,
      inactiveOpacity,
      inactiveColor,
      activeOpacity,
      activeColor,
      isActive,
    } = this.props;
    const props = {
      id,
      inactiveOpacity,
      inactiveColor,
      activeOpacity,
      activeColor,
      isActive,
    };
    const child = React.Children.only(children);
    const style = {
      color: isActive ? activeColor : inactiveColor,
      opacity: isActive ? activeOpacity : inactiveOpacity,
    };
    switch ( child.type.displayName || child.type.name ) {
      case 'AnimatedComponent':
        style.color = animate.interpolate({
          inputRange: [0, 1],
          outputRange: [inactiveColor, activeColor],
        });
        style.opacity = animate.interpolate({
          inputRange: [0, 1],
          outputRange: [inactiveOpacity, activeOpacity],
        });
        break;
    }
    if ( typeof child.props.style !== 'undefined' ) {
      props.style = [ child.props.style, style ];
    } else {
      props.style = style;
    }
    return React.cloneElement(child, props)
  }

  render() {
    const { id, separator, separatorWidth, onLayout, onPress } = this.props;
    return <Touchable key={id} style={{ marginRight: separator ? separatorWidth : 0 }} onLayout={onLayout} onPress={onPress}>
      { this.renderChildren() }
    </Touchable>
  }

}

