
import React, { Component } from 'react';
import { View, Animated, StyleSheet, InteractionManager } from 'react-native';

import { Tab, TabList } from 'px/components/AnimatedTab';
import source from 'px/assets/logo/Icon-60.png';

export default class NavigationLogo extends Component {

  setNativeProps(props) {
    this.node && this.node.setNativeProps(props);
  }

  state = {
    animate: new Animated.Value(1),
    tabview: false,
  }

  componentDidMount() {
    this._mount = true;
    InteractionManager.runAfterInteractions(() => {
      setTimeout(_ => {
        Animated.timing(
          this.state.animate,
          {
            toValue: 0,
            duration: 250,
          }
        ).start(() => this._mount && this.setState({ tabview: true }));
      }, 250);
    });
  }

  componentWillUnmount() {
    this._mount = false;
  }

  renderTabList() {
    return <TabList activeTab="discover">
      <Tab id="discover">
        <Animated.Text style={styles.menu}>DISCOVER</Animated.Text>
      </Tab>
      <Tab id="latest">
        <Animated.Text style={styles.menu}>LATEST</Animated.Text>
      </Tab>
      <Tab id="collections">
        <Animated.Text style={styles.menu}>COLLECTIONS</Animated.Text>
      </Tab>
    </TabList>
  }

  renderLogo() {
    const { animate } = this.state;
    const opacity = animate.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    return <Animated.Image style={[styles.image, { opacity }]} source={source} />
  }

  render() {
    const { tabview } = this.state;
    return <View style={styles.base} ref={n => this.node = n}>
    { tabview && this.renderTabList() }
    { !tabview && this.renderLogo() }
    </View>
  }

}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    height: 42,
    width: 42,
  },
  menu: {
    fontSize: 14,
    fontWeight: '600',
  },
});

