
import React, { Component } from 'react';
import { Image, InteractionManager } from 'react-native';

import { SharedView } from 'px/components/Navigation';

export default class TransitionImage extends Component {

  static defaultProps = {
    ...Image.defaultProps,
    name          : null,
    route         : null,
    mask          : false,
  }

  static propTypes = {
    ...Image.propTypes,
    name          : React.PropTypes.string.isRequired,
    route         : React.PropTypes.string.isRequired,
    mask          : React.PropTypes.bool,
  }

  setNativeProps(props) {
    this.node && this.node.setNativeProps(props);
  }

  render() {
    const { name, route, ...props } = this.props;
    return <SharedView ref={n => this.node = n} name={name} containerRouteName={route}>
      <Image {...props} />
    </SharedView>
  }

}

