
import React, { Component } from 'react';
import { Navigator } from 'react-native';
import { createNavigationContainer, createNavigator, StackRouter, CardStack } from 'react-navigation';

import CoreSharedView from './SharedView';
import CoreSharedElements from './SharedElements';
import CoreSharedElementTransitioner from './SharedElementTransitioner';

import CoreController from 'px/components/Controller';

export const SharedView = CoreSharedView;
export const SharedElements = CoreSharedElements;
export const Controller = CoreController;

class Transitioner extends Component {

  render() {
    return <CoreSharedElementTransitioner { ...this.props } />
  }

}

export default class Navigation extends Component {

  static defaultProps = {
    style       : { },
    transparent : false,
    borderless  : false,
    children    : null,
  }

  static propTypes = {
    style       : React.PropTypes.object,
    transparent : React.PropTypes.bool,
    borderless  : React.PropTypes.bool,
    children    : React.PropTypes.oneOfType([
      React.PropTypes.element,
      React.PropTypes.arrayOf(React.PropTypes.element),
    ]),
  }

  constructor(props) {
    super(props);
    const routes = { };
    const controllers = this.controllers();
    for ( const controller of controllers ) {
      const { props: { id, component } } = controller;
      if ( routes[id] ) continue;
      routes[id] = { screen: component };
    }
    const router = StackRouter(routes);
    this.Navigator = createNavigationContainer(createNavigator(router)(Transitioner));
  }

  controllers() {
    const { children } = this.props;
    return (Array.isArray(children) ? children : [children])
      .filter(n => n)
      .filter(n => n.type === CoreController);
  }

  render() {
    const { Navigator } = this;
    return <Navigator />
  }

}
