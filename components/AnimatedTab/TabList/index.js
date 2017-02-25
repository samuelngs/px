
import React, { Component } from 'react';
import { Animated, ScrollView, StyleSheet, InteractionManager } from 'react-native';

import Tab from '../Tab';

export default class TabList extends Component {

  static defaultProps = {
    inactiveOpacity: .5,
    inactiveColor: '#aaa',
    activeOpacity: 1,
    activeColor: '#000',
    activeTab: '',
    style: {},
    separatorWidth: 18,
  }

  static propTypes = {
    inactiveOpacity: React.PropTypes.number,
    inactiveColor: React.PropTypes.string,
    activeOpacity: React.PropTypes.number,
    activeColor: React.PropTypes.string,
    activeTab: React.PropTypes.string,
    style: React.PropTypes.object,
    separatorWidth: React.PropTypes.number,
  }

  state = {
    animate: new Animated.Value(0),
    activeTab: this.props.activeTab,
    layout: {
      root: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      menu: [ ],
    },
    ready: false,
  }

  componentDidMount() {
    this._mount = true;
    InteractionManager.runAfterInteractions(() => {
      setTimeout(_ => {
        Animated.timing(
          this.state.animate,
          {
            toValue: 1,
            duration: 250,
          }
        ).start();
      }, 100);
    });
  }

  componentWillUnmount() {
    this._mount = false;
  }

  componentLayoutUpdate({ nativeEvent: { layout: root } }) {
    if ( !this._mount ) return;
    const { layout: prev } = this.state;
    const layout = { ...prev, root };
    return this.setState({ layout }, () => this.componentIsReady());
  }

  componentMenuLayout(i, { nativeEvent: { layout: state } }) {
    if ( !this._mount ) return;
    const { layout: { root, menu: prev } } = this.state;
    const menu = [ ...prev ];
    menu[i] = state;
    const layout = { root, menu };
    return this.setState({ layout }, () => this.componentIsReady());
  }

  componentIsReady() {
    if ( !this._mount ) return;
    const { layout: { root, menu } } = this.state;
    const { width: rootWidth } = root;
    const { width: itemWidth }  = menu[0] || { width: 0 };
    const ready = (rootWidth - itemWidth) / 2 > 0;
    return this.setState({ ready });
  }

  componentCheckActiveTab({ x, y }) {
    const { separatorWidth } = this.props;
    const { layout: { menu } } = this.state;
    const offsets = [ ];
    const distances = [ ];
    const positions = [ ];
    for ( const [index, layout] of menu.entries() ) {
      const prevMenu = menu[index - 1];
      const prevOffset = offsets[index - 1];
      const prevDistance = distances[index - 1];
      const prevPosition = positions[index - 1];
      if ( index === 0 ) {
        offsets[index] = 0;
        distances[index] = layout.width + separatorWidth / 2;
        positions[index] = layout.width / 2;
      } else {
        offsets[index] = prevOffset + (prevMenu.width + layout.width) / 2 + separatorWidth;
        distances[index] = prevDistance + separatorWidth / 2 + layout.width + separatorWidth / 2;
        positions[index] = prevDistance + (separatorWidth + layout.width) / 2 - separatorWidth;
      }
    }
    const { index } = this.nearest(x, positions);
    const { props: { id } } = this.children()[index];
    return this.setState({ activeTab: id }, () => {
      const { node } = this;
      if ( !node ) return;
      node.scrollTo({ x: offsets[index] || 0, animated: true });
    });
  }

  nearest(num, arr) {
    let value = arr[0];
    let index = 0;
    let diff = Math.abs(num - value);
    for ( let i = 0; i < arr.length; i++ ) {
      const nd = Math.abs (num - arr[i]);
      if (nd < diff) {
        diff = nd;
        value = arr[i];
        index = i;
      }
    }
    return { value, index };
  }

  onScrollEndDrag({ nativeEvent: { contentOffset: { x, y } } }) {
    setTimeout(_ => {
      if ( this._momentum ) return;
      this.componentCheckActiveTab({ x, y });
    }, 0);
  }

  onMomentumScrollBegin() {
    this._momentum = true;
  }

  onMomentumScrollEnd({ nativeEvent: { contentOffset: { x, y } } }) {
    if ( !this._momentum ) return;
    this._momentum = false;
    this.componentCheckActiveTab({ x, y });
  }

  onItemPress(id) {
    const childrens = this.children();
    const { separatorWidth } = this.props;
    const { layout: { menu } } = this.state;
    const offsets = [ ];
    let i = -1;
    for ( const [index, { props }] of childrens.entries() ) {
      if ( id === props.id ) {
        i = index;
        break;
      }
    }
    for ( const [index, layout] of menu.entries() ) {
      const prevMenu = menu[index - 1];
      const prevOffset = offsets[index - 1];
      if ( index === 0 ) {
        offsets[index] = 0;
      } else {
        offsets[index] = prevOffset + (prevMenu.width + layout.width) / 2 + separatorWidth;
      }
      if ( i === index ) {
        break;
      }
    }
    return this.setState({ activeTab: id }, () => {
      const { node } = this;
      if ( !node ) return;
      node.scrollTo({ x: offsets[i] || 0, animated: true });
    });
  }

  children() {
    const { children } = this.props;
    return (Array.isArray(children) ? children : [children])
      .filter(n => n)
      .filter(n => n.type === Tab);
  }

  getScrollContainerStyle() {
    const { ready, layout: { root, menu } } = this.state;
    const { width: rootWidth } = root;
    const { width: firstItemWidth }  = menu[0] || { width: 0 };
    const { width: lastItemWidth } = menu[menu.length - 1] || { width: 0 };
    const styles = {
      paddingLeft: 0,
      paddingRight: 0,
      opacity: 0,
    };
    if ( !ready ) return styles;
    styles.paddingLeft = (rootWidth - firstItemWidth) / 2 + 2;
    styles.paddingRight = (rootWidth - lastItemWidth) / 2 - 2;
    styles.opacity = 1;
    return styles;
  }

  renderChildren() {
    const children = this.children();
    const {
      inactiveOpacity,
      inactiveColor,
      activeOpacity,
      activeColor,
    } = this.props;
    const { activeTab } = this.state;
    const len = React.Children.toArray(children).length;
    return React.Children.map(children, (child, i) => React.cloneElement(child, {
      inactiveOpacity,
      inactiveColor,
      activeOpacity,
      activeColor,
      isActive: activeTab === child.props.id,
      separator: len > 1 && i < len - 1,
      onLayout: (e) => this.componentMenuLayout(i, e),
      onPress: () => this.onItemPress(child.props.id),
    }));
  }

  render() {
    const { style } = this.props;
    const { animate } = this.state;
    const contentContainerStyle = this.getScrollContainerStyle();
    const opacity = animate.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    return <Animated.View style={[styles.base, style, { opacity }]} onLayout={(e) => this.componentLayoutUpdate(e)}>
      <ScrollView
        ref={n => this.node = n}
        contentContainerStyle={contentContainerStyle}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onScrollEndDrag={e => this.onScrollEndDrag(e)}
        onMomentumScrollBegin={e => this.onMomentumScrollBegin(e)}
        onMomentumScrollEnd={e => this.onMomentumScrollEnd(e)}
        horizontal
      >
        { this.renderChildren() }
      </ScrollView>
    </Animated.View>
  }

}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
