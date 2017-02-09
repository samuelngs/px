
import React, { Component } from 'react';

export default class Controller extends Component {

  static defaultProps = {
    id          : '',
    title       : '',
    leftButton  : '',
    rightButton : '',
    type        : 'screen',
    props       : { },
    component   : undefined,
    navigator   : undefined,
  }

  static propTypes = {
    id          : React.PropTypes.string.isRequired,
    title       : React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.func, React.PropTypes.element ]),
    leftButton  : React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.func, React.PropTypes.element ]),
    rightButton : React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.func, React.PropTypes.element ]),
    type        : React.PropTypes.oneOf([ 'screen', 'modal' ]).isRequired,
    props       : React.PropTypes.object,
    component   : React.PropTypes.func.isRequired,
    navigator   : React.PropTypes.object,
  }

  onNavigationPressed(layout) {
    if ( !this.component ) return;
    switch ( layout ) {
      case 'left':
        return typeof this.component.onLeftButtonPressed === 'function' && this.component.onLeftButtonPressed();
      case 'right':
        return typeof this.component.onRightButtonPressed === 'function' && this.component.onRightButtonPressed();
      case 'title':
        return typeof this.component.onTitlePressed === 'function' && this.component.onTitlePressed();
    }
  }

  render() {
    const { component: Component, navigator, props } = this.props;
    return <Component ref={n => this.component = n} { ...props } navigator={navigator} />
  }

}

