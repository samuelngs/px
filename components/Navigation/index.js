
import React, { Component } from 'react';
import { Navigator, TouchableHighlight, View, Text, StyleSheet } from 'react-native';

import Controller from 'px/components/Controller';
import navigationStyles from './styles';

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

  onWillFocus() {
    this.rendered = false;
  }

  onDidFocus() {
    this.rendered = true;
  }

  onNavigationPressed(layout) {
    const { ui, rendered } = this;
    if ( !ui || !rendered ) return;
    return typeof ui.onNavigationPressed === 'function' && ui.onNavigationPressed(layout);
  }

  controllers() {
    const { children } = this.props;
    return (Array.isArray(children) ? children : [children])
      .filter(n => n)
      .filter(n => n.type === Controller);
  }

  actions(navigator, controllers) {
    return {
      push: (targetId, args) => {
        let opts;
        for ( const { props } of controllers ) {
          const { id } = props;
          if ( id === targetId ) {
            opts = props;
            break
          }
        }
        if ( !opts ) {
          throw `route \`${targetId}\` does not exist`;
        }
        const { id, title, leftButton, rightButton, type, props } = opts;
        return navigator.push({ id, title, leftButton, rightButton, type, props: { ...props, ...args }  });
      },
      pop: props => {
        if (typeof props === 'object' && props !== null) {
          const routes = navigator.getCurrentRoutes();
          const route = routes[routes.length - 2];
          if ( route ) {
            navigator.replacePrevious({
              ...route,
              props: {
                ...route.props,
                ...props,
              },
            });
          }
        }
        navigator.pop();
      },
      patch: props => {
        if (typeof props === 'object' && props !== null) {
          const routes = navigator.getCurrentRoutes();
          const route = routes[routes.length - 1];
          if ( route ) {
            navigator.replace({
              ...route,
              props: {
                ...route.props,
                ...props,
              },
            });
          }
        }
      },
    }
  }

  configureScene(route, routeStack) {
    if ( route.type === 'modal' ) {
      return Navigator.SceneConfigs.FloatFromBottom;
    }
    return Navigator.SceneConfigs.PushFromRight;
  }

  renderScene(route, navigator, controllers) {
    for ( const controller of controllers ) {
      const { props: { id } } = controller;
      if ( route.id === id ) {
        return React.cloneElement(controller, {
          key: route.__navigatorRouteID,
          ref: n => this.ui = n,
          props: route.props,
          navigator: this.actions(navigator, controllers),
        })
      }
    }
  }

  renderTitle(route, navigator, index, navState) {
    const { title } = route;
    if ( !title ) {
      return null;
    }
    let children;
    switch ( typeof title ) {
      case 'string':
        children = <Text style={styles.navigationBarTitle}>{ title }</Text>;
        break;
      case 'function':
        children = title();
      case 'object':
        children = title;
        break;
    }
    return <TouchableHighlight style={styles.navigationBarButton} underlayColor="transparent" onPress={() => this.onNavigationPressed('title')}>
      { children }
    </TouchableHighlight>
  }

  renderNavigationButton(route, navigator, index, navState, layout) {
    const { leftButton, rightButton } = route;
    const button = layout === 'left' ? leftButton : rightButton;
    if ( !button ) {
      return null;
    }
    let children;
    switch ( typeof button ) {
      case 'string':
        children = <Text style={styles.navigationBarItem}>{ button }</Text>;
        break;
      case 'function':
        children = button();
      case 'object':
        children = button;
        break;
    }
    return <TouchableHighlight style={styles.navigationBarButton} underlayColor="transparent" onPress={() => this.onNavigationPressed(layout)}>
      { children }
    </TouchableHighlight>
  }

  renderNavigationBar() {
    const { style, transparent, borderless } = this.props;
    return <Navigator.NavigationBar
      routeMapper={{
        LeftButton: (route, navigator, index, navState) => this.renderNavigationButton(route, navigator, index, navState, 'left'),
        RightButton: (route, navigator, index, navState) => this.renderNavigationButton(route, navigator, index, navState, 'right'),
        Title: (route, navigator, index, navState) => this.renderTitle(route, navigator, index, navState),
      }}
      navigationStyles={navigationStyles}
      style={[
        styles.navigationBar,
        transparent && styles.navigationBarTransparent,
        borderless && styles.navigationBarBorderless,
        style,
      ]}
    />
  }

  render() {
    const controllers = this.controllers();
    if ( controllers.length === 0 ) {
      return <View style={styles.container}>
        <Text style={styles.component}>Navigation</Text>
        <Text style={styles.warning}>No controllers available</Text>
      </View>
    }
    const { props: { id, title, leftButton, rightButton, type, props } } = controllers[0];
    return <Navigator
      onWillFocus={() => this.onWillFocus()}
      onDidFocus={() => this.onDidFocus()}
      initialRoute={{ id, title, leftButton, rightButton, type, props }}
      configureScene={(route, routeStack) => this.configureScene(route, routeStack)}
      renderScene={(route, navigator) => this.renderScene(route, navigator, controllers)}
      navigationBar={this.renderNavigationBar()}
    />
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  navigationBar: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: .5,
    borderBottomColor: 'rgba(0, 0, 0, 0.07)',
  },
  navigationBarTransparent: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  navigationBarBorderless: {
    borderBottomWidth: 0,
  },
  navigationBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 14,
  },
  navigationBarTitle: {
    color: '#000',
    fontSize: 17,
    fontWeight: '600',
  },
  navigationBarItem: {
    color: '#444',
    fontSize: 16,
  },
  component: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  warning: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
