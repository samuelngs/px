
import React, { Component } from 'react';
import { View, Image, TouchableHighlight, StyleSheet, Dimensions } from 'react-native';

import { SharedView } from 'px/components/Navigation';
import ActionBar from 'px/components/ActionBar';
import Touchable from 'px/components/Touchable';
import TransitionImage from 'px/components/TransitionImage';
import ProgressiveTransitionImage from 'px/components/ProgressiveTransitionImage';

import GridImage from 'px/assets/icons/grid.png';
import ListImage from 'px/assets/icons/list.png';

export default class Photo extends Component {

  static navigationOptions = {
    header: {
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
  }

  onBack() {
    const { navigation } = this.props;
    return navigation.goBack();
  }

  render() {
    const { navigation: { state: { routeName, params: { photo: src } } } } = this.props;
    const { width } = Dimensions.get('window');
    const height = width;
    // const height = width / src.width * src.height;
    // const height = 300;
    return <View style={styles.container}>
      <Touchable onPress={() => this.onBack()}>
        <TransitionImage name={src.id} route={routeName} source={{ uri: src.urls.regular }} style={{ width, height }} />
      </Touchable>
    </View>
  }

}

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


