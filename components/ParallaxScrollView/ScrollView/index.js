
import React, { Component } from 'react';
import { Animated, View, ScrollView, StyleSheet, Dimensions, InteractionManager } from 'react-native';

import ParallaxHeader from '../Header';
import ParallaxContainer from '../Container';

export default class ParallaxScrollView extends Component {

  static defaultProps = {
    height: 300,
    backgroundColor: '#fff',
  }

  static propTypes = {
    height: React.PropTypes.number,
    backgroundColor: React.PropTypes.string,
  }

  state = {
    dimensions: {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    },
    animate: new Animated.Value(0),
  }

  setNativeProps(props) {
    this.node && this.node.setNativeProps(props);
  }

  componentLayoutUpdate({ nativeEvent: { layout: { width, height } } }) {
    InteractionManager.runAfterInteractions(() => {
      const dimensions = { width, height };
      return this.setState({ dimensions });
    })
  }

  children() {
    const { children, height, backgroundColor } = this.props;
    const { animate, dimensions } = this.state;
    const props = { height, backgroundColor, animate, dimensions };
    const layouts = { header: null, container: null };
    React.Children.toArray(children)
      .filter(n => n)
      .filter(n => n.type === ParallaxHeader || n.type === ParallaxContainer)
      .forEach(n => {
        switch ( n.type ) {
          case ParallaxHeader:
            if ( !layouts.header ) layouts.header = React.cloneElement(n, props);
            break;
          case ParallaxContainer:
            if ( !layouts.container ) layouts.container = React.cloneElement(n, props);
            break;
        }
      });
    return layouts;
  }

  render() {
    const { height } = this.props;
    const { animate } = this.state;
    const { header, container } = this.children();
    return <View style={styles.base} onLayout={(e) => this.componentLayoutUpdate(e)}>
      { header }
      <ScrollView
        ref={n => this.node = n}
        style={styles.scrollView}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: this.state.animate }}}]
        )}
      >
        { container }
      </ScrollView>
    </View>;
  }

}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});
