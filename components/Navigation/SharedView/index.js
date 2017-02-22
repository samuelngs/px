
import React, { Component } from 'react';
import { View, UIManager, findNodeHandle } from 'react-native';

import { SharedElement } from '../SharedElements';

class SharedView extends Component {

  static defaultProps = {
    style: null,
  }

  static propTypes = {
    style: React.PropTypes.object,
  }

  static contextTypes = {
    registerSharedView: React.PropTypes.func,
    unregisterSharedView: React.PropTypes.func,
  };

  setNativeProps(props) {
    this.node && this.node.setNativeProps(props);
  }

  render() {
    const { style } = this.props;
    return <View ref={n => this.node = n} collapsable={false} style={style}>
      {this.props.children}
    </View>
  }

  componentDidMount() {
    const { registerSharedView } = this.context;
    if (!registerSharedView) return;
    const { name, containerRouteName } = this.props;
    const nativeHandle = findNodeHandle(this.node);
    registerSharedView(new SharedElement(
      name,
      containerRouteName,
      React.Children.only(this.props.children),
      nativeHandle,
    ));
  }

  componentWillUnmount() {
    const { unregisterSharedView } = this.context;
    if (!unregisterSharedView) return;
    const { name, containerRouteName } = this.props;
    unregisterSharedView(name, containerRouteName);
  }

}

export default SharedView;
