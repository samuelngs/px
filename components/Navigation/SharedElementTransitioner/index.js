
import React, { Component } from 'react';

import {
  Easing,
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  UIManager,
  InteractionManager,
} from 'react-native';

import {
  CardStack,
  Transitioner,
  addNavigationHelpers,
} from 'react-navigation';

import NavigationStyles from '../NavigationStyles';
import SharedElements from '../SharedElements';

import ActionBar from 'px/components/ActionBar';

const {
  Header,
} = CardStack;

class SharedElementTransitioner extends Component {

  static childContextTypes = {
    registerSharedView: React.PropTypes.func,
    unregisterSharedView: React.PropTypes.func,
  }

  state = {
    sharedItems: new SharedElements(),
    itemsToMeasure: [],
  }

  measure(sharedItem) {
    return new Promise((resolve, reject) => {
      UIManager.measureInWindow(
        sharedItem.nativeHandle,
        (x, y, width, height) => resolve({ x, y, width, height }),
      );
    });
  }

  setSharedElementsState(fun, callback) {
    this.setState((prevState) => (
      { sharedItems: fun(prevState) }
    ), callback);
  }

  addSharedElement(sharedItem) {
    this.setSharedElementsState(prevState =>
      prevState.sharedItems.add(sharedItem)
    );
  }

  removeSharedElement(name, containerRouteName) {
    this.setSharedElementsState(prevState =>
      prevState.sharedItems.remove(name, containerRouteName)
    );
  }

  getChildContext() {
    return {
      registerSharedView: (sharedItem) => {
        this.addSharedElement(sharedItem);
        const { name, containerRouteName } = sharedItem;
        const matchingItem = this.state.sharedItems.findMatchByName(name, containerRouteName);
        if (matchingItem) {
          this.setState((prevState) => ({
            sharedItems: prevState.sharedItems,
            itemsToMeasure: [...prevState.itemsToMeasure, sharedItem, matchingItem]
          }));
        }
      },
      unregisterSharedView: (name, containerRouteName) => {
        this.removeSharedElement(name, containerRouteName);
      },
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || nextState.itemsToMeasure.length === 0;
  }

  async _onLayout() {
    let toUpdate = [];
    for (let item of this.state.itemsToMeasure) {
      const { name, containerRouteName } = item;
      const metrics = await this.measure(item);
      toUpdate.push({ name, containerRouteName, metrics });
    }
    if (toUpdate.length > 0) {
      this.setState(prevState => ({
        sharedItems: prevState.sharedItems.updateMetrics(toUpdate),
        itemsToMeasure: [],
      }));
    }
  }

  render() {
    return <Transitioner
      configureTransition={this._configureTransition.bind(this)}
      render={this._render.bind(this)}
      navigation={this.props.navigation}
      style={this.props.style}
    />
  }

  _configureTransition() {
    return {
      duration: 250,
      easing: Easing.inOut(Easing.ease),
    }
  }

  _getScreenConfig(props, key) {
    return props && this.props.router.getScreenConfig(props.navigation, key) || { };
  }

  _render(props, prevProps) {
    const scenes = props.scenes.map(scene => this._renderScene({ ...props, scene }));
    const overlay = this._renderOverlay(props, prevProps);
    const header = this._renderHeader(props, prevProps);
    const actionbar = this._renderActionbar(props, prevProps);
    return <View style={styles.scenes}>
      {scenes}
      {overlay}
      {header}
      {actionbar}
    </View>
  }

  _getOverlayContainerStyle(progress) {
    const left = progress.interpolate({
      inputRange: [0, 0.999999, 1],
      outputRange: [0, 0, 100000],
    });
    return { left };
  }

  _getSharedElementStyle(props, prevProps, itemFrom, itemTo) {
    const { position, progress, navigationState: {index} } = props;
    const getElementType = (item) => {
      const type = item.reactElement.type;
      return type && (type.displayName || type.name);
    }
    const animateWidthHeight = (itemFrom, itemTo) => {
      const width = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [itemFrom.metrics.width, itemTo.metrics.width],
      });
      const height = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [itemFrom.metrics.height, itemTo.metrics.height],
      });
      return { width, height };
    };

    const animateScale = (itemFrom, itemTo) => {
      const toVsFromScaleX = itemTo.scaleRelativeTo(itemFrom).x;
      const toVsFromScaleY = itemTo.scaleRelativeTo(itemFrom).y;
      const scaleX = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, toVsFromScaleX]
      });
      const scaleY = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, toVsFromScaleY]
      });
      const left = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [itemFrom.metrics.x, itemTo.metrics.x + itemFrom.metrics.width / 2 * (toVsFromScaleX - 1)],
      });
      const top = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [itemFrom.metrics.y, itemTo.metrics.y + itemFrom.metrics.height / 2 * (toVsFromScaleY - 1)],
      });
      return {
        left,
        top,
        transform: [ { scaleX }, { scaleY } ],
      };
    };

    const animateFontSize = (itemFrom, itemTo) => {
      const getFontSize = element => (element.props && element.props.fontSize) || 12;
      return {
        fontSize: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [getFontSize(itemFrom.reactElement), getFontSize(itemTo.reactElement)],
        })
      };
    };

    const elementType = getElementType(itemFrom);
    let style;
    switch (elementType) {
      case 'Image':
        style = animateWidthHeight(itemFrom, itemTo);
        break;
      case 'Text':
        style = {
          ...animateWidthHeight(itemFrom, itemTo),
          ...animateFontSize(itemFrom, itemTo),
        };
        break;
      default:
        style = animateScale(itemFrom, itemTo);
        break;
    };

    const left = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [itemFrom.metrics.x, itemTo.metrics.x],
    });

    const top = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [itemFrom.metrics.y, itemTo.metrics.y],
    });

    return {
      position: 'absolute',
      left,
      top,
      ...style,
    };

  }

  _getBBox(metricsArray) {
    let left, top, right, bottom;
    left = top = Number.MAX_VALUE;
    right = bottom = Number.MIN_VALUE;
    metricsArray.forEach(m => {
      if (m.x < left) left = m.x;
      if (m.y < top) top = m.y;
      if (m.x + m.width > right) right = m.x + m.width;
      if (m.y + m.height > bottom) bottom = m.y + m.height;
    });
    const width = right - left;
    const height = bottom - top;
    return { left, top, right, bottom, width, height };
  }

  _renderActionbar(props, prevProps) {
    const { left, right, center } = this._getScreenConfig(props, 'actionbar');
    const { position, scene, progress } = props;
    const { index } = scene;
    const n = (left || right || center) ? 1 : 0;
    const opacity = position.interpolate({
      inputRange: [index - 1, index - 0.01, index, index + 0.99, index + 1],
      outputRange: [0, 0, n, n, 0],
    });
    const navigation = this._getChildNavigation(scene);
    const args = { left, right, center };
    if (typeof left === 'function') args.left = left(navigation);
    if (typeof right === 'function') args.right = right(navigation);
    if (typeof center === 'function') args.center = center(navigation);
    return <ActionBar { ...args } style={{ opacity }} />
  }

  _getHeaderStyle(props, prevProps) {
    const { position, scene, progress } = props;
    const { index } = scene;
    const { style = {} } = this._getScreenConfig(props, 'header');
    const { style: prevStyle = {} } = this._getScreenConfig(prevProps, 'header');
    const defaults = {
      backgroundColor : 'rgba(255, 255, 255, 1)',
      opacity         : 1.0,
    };
    const styles = { ...style };
    for (const [key, value] of Object.entries(defaults)) {
      const curr = typeof style[key] === 'undefined' ? value : style[key];
      const prev = typeof prevStyle[key] === 'undefined' ? value : prevStyle[key];
      if ( curr !== prev ) {
        styles[key] = position.interpolate({
          inputRange: [index - 1, index - 0.10, index, index + 1],
          outputRange: [prev, curr, curr, curr],
        });
      }
    }
    return styles;
  }

  _renderHeader(props, prevProps) {
    const { router } = this.props;
    const { position, scene, progress } = props;
    const { index } = scene;
    const style = this._getHeaderStyle(props, prevProps);
    return <Header
      {...props}
      router={router}
      style={[
        NavigationStyles.base,
        style,
      ]}
      mode="screen"
      onNavigateBack={() => this.props.navigation.goBack(null)}
      renderLeftComponent={props => {
        const { left } = this._getScreenConfig(props, 'header');
        return left;
      }}
      renderRightComponent={props => {
        const { right } = this._getScreenConfig(props, 'header');
        return right;
      }}
      renderTitleComponent={props => {
        const { title } = this._getScreenConfig(props, 'header');
        return title;
      }}
    />
  }

  _renderMaskContainer(pairs, props, prevProps) {
    if (!prevProps || pairs.length === 0) return null;
    const masks = [ ];
    const from = pairs.map(p => p.fromItem);
    const to = pairs.map(p => p.toItem);
    const { navigationState: { index } } = props;
    const { navigationState: { index: prevIndex } } = prevProps;
    for ( const [ index, layer ] of from.entries() ) {
      const item = index > prevIndex ? layer : to[index];
      const { metrics, reactElement: { props: { mask } } } = item;
      const { x, y, width, height } = metrics;
      if ( mask ) {
        const style = {
          backgroundColor: '#fff',
          position: 'absolute',
          left: x,
          top: y,
          width,
          height,
        };
        masks.push(<View key={index} style={style} />);
      }
    }
    return masks;
  }

  _renderOverlay(props, prevProps) {
    const fromRoute = prevProps ? prevProps.scene.route.routeName : 'unknownRoute';
    const toRoute = props.scene.route.routeName;
    const pairs = this.state.sharedItems.getMeasuredItemPairs(fromRoute, toRoute);
    const sharedElements = pairs.map((pair, idx) => {
      const {fromItem, toItem} = pair;
      const animatedStyle = this._getSharedElementStyle(props, prevProps, fromItem, toItem);
      const element = fromItem.reactElement;
      const AnimatedComp = Animated.createAnimatedComponent(element.type);
      return React.createElement(AnimatedComp,
          { ...element.props, style: [element.props.style, animatedStyle], key: idx },
          element.props.children);
    });
    const containerStyle = this._getOverlayContainerStyle(props.progress);
    return <Animated.View style={[styles.overlay, this.props.style, containerStyle]}>
      {this._renderMaskContainer(pairs, props, prevProps)}
      {sharedElements}
    </Animated.View>
  }

  _renderBackgroundOverlay(progress, position, index) {
    const opacity = position.interpolate({
      inputRange: [index - 1, index - 0.01, index, index + 0.99, index + 1],
      outputRange: [0, 0, 0, 1, 1],
    });
    const animatedStyle = {
      backgroundColor: '#fff',
      opacity,
      ...this._getOverlayContainerStyle(progress)
    };
    return <Animated.View style={[styles.overlay, animatedStyle]} />;
  }

  _renderScene(transitionProps) {
    const { position, scene, progress } = transitionProps;
    const { index } = scene;
    const inputRange = [index - 1, index - 0.01, index, index + 0.99, index + 1];
    const opacity = position.interpolate({
      inputRange,
      outputRange: [0, 0, 1, 1, 0],
    });
    const style = { opacity };
    const Scene = this.props.router.getComponentForRouteName(scene.route.routeName);
    const navigation = this._getChildNavigation(scene);
    return <Animated.View key={transitionProps.scene.route.key} style={[style, styles.scene]}
      onLayout={this._onLayout.bind(this)}
    >
      <Scene navigation={navigation} />
      {this._renderBackgroundOverlay(progress, position, index)}
    </Animated.View>
  }

  _getChildNavigation = (scene: NavigationScene): NavigationScreenProp<NavigationRoute, NavigationAction> => {
    if (!this._childNavigationProps) this._childNavigationProps = {};
    let navigation = this._childNavigationProps[scene.key];
    if (!navigation || navigation.state !== scene.route) {
      navigation = this._childNavigationProps[scene.key] = addNavigationHelpers({
        ...this.props.navigation,
        state: scene.route,
      });
    }
    return navigation;
  }

}

const styles = StyleSheet.create({
  scenes: {
    flex: 1,
  },
  scene: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});

export default SharedElementTransitioner;
