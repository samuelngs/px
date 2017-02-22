
import React, { Component } from 'react';

export default class Wrapper extends Component {

  static childContextTypes = {
    cache: React.PropTypes.object,
  }

  state = {
    cache: new Map(),
  }

  getChildContext() {
    const { cache } = this.state;
    return {
      cache,
    };
  }

  render() {
    const { children } = this.props;
    return children;
  }

}

