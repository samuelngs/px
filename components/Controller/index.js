
import React, { Component } from 'react';

export default class Controller extends Component {

  static defaultProps = {
    id          : '',
    type        : 'screen',
    props       : { },
    component   : undefined,
    navigator   : undefined,
  }

  static propTypes = {
    id          : React.PropTypes.string.isRequired,
    type        : React.PropTypes.oneOf([ 'screen', 'modal' ]).isRequired,
    props       : React.PropTypes.object,
    component   : React.PropTypes.func.isRequired,
    navigator   : React.PropTypes.object,
  }

  render() {
    return null;
  }

}

