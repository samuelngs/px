
import React, { Component } from 'react';
import { View, Text, Image, TouchableHighlight, StyleSheet, Dimensions, InteractionManager } from 'react-native';

import { SharedView } from 'px/components/Navigation';
import ActionBar from 'px/components/ActionBar';
import Touchable from 'px/components/Touchable';
import TransitionImage from 'px/components/TransitionImage';
import ProgressiveTransitionImage from 'px/components/ProgressiveTransitionImage';
import ParallaxScrollView, { ParallaxHeader, ParallaxContainer } from 'px/components/ParallaxScrollView';
import NavigationBack from 'px/components/NavigationBack';

import GridImage from 'px/assets/icons/grid.png';
import ListImage from 'px/assets/icons/list.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionBarButton: {
    height: 46,
    width: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBarImage: {
    height: 30,
    width: 30,
  },
});

export default class Photo extends Component {

  static navigationOptions = {
    header: {
      left: navigation => <NavigationBack navigation={navigation} />,
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        shadowRadius: 0,
        shadowOpacity: 0,
        shadowColor: '#fff',
        shadowOffset: {
          width: 0,
          height: 0,
        },
      },
    },
    statusbar: {
      barStyle: 'light-content',
    },
  }

  state = {
    dimensions: {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    },
  }

  constructor(props) {
    super(props);
    this.onLayout = this.onLayout.bind(this);
    this.onImagePress = this.onImagePress.bind(this);
  }

  onLayout({ nativeEvent: { layout: { width, height } } }) {
    InteractionManager.runAfterInteractions(() => {
      const dimensions = { width, height };
      return this.setState({ dimensions });
    })
  }

  onImagePress(e) {
    const { navigation } = this.props;
    return navigation.goBack();
  }

  render() {
    const { navigation: { state: { routeName, params: { photo } } } } = this.props;
    const { dimensions: { width } } = this.state;
    const height = width;
    return <View style={styles.container} onLayout={this.onLayout}>
      <ParallaxScrollView height={height}>
        <ParallaxHeader>
          <TransitionImage name={photo.id} route={routeName} source={{ uri: photo.urls.regular }} style={{ width, height }} />
        </ParallaxHeader>
        <ParallaxContainer onPress={this.onImagePress}>
          <View style={{ height: 500 }}>
          </View>
        </ParallaxContainer>
      </ParallaxScrollView>
    </View>
  }

}

