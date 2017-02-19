
import React, { Component } from 'react';
import { Image, ScrollView, TouchableHighlight, StyleSheet } from 'react-native';
import Lightbox from 'react-native-lightbox';

import ProgressiveImage from 'px/components/ProgressiveImage';

export default class ImageDisplay extends Component {

  static defaultProps = {
    host: '',
    src: { },
    dimensions: {
      width: 0,
      height: 0,
    },
    padding: 0,
    radius: 0,
    lightbox: false,
    onPress: () => { },
  }

  static propTypes = {
    host: React.PropTypes.string,
    src: React.PropTypes.object,
    dimensions: React.PropTypes.shape({
      width: React.PropTypes.number,
      height: React.PropTypes.number,
    }),
    padding: React.PropTypes.number,
    radius: React.PropTypes.number,
    lightbox: React.PropTypes.bool,
    onPress: React.PropTypes.func,
  }

  renderFullscreen(src) {
    const { id } = this.props;
    return <ScrollView
      style={styles.container}
      contentContainerStyle={styles.container}
      minimumZoomScale={1}
      maximumZoomScale={4}
      centerContent={true}
    >
      <Image style={styles.container} resizeMode="contain" source={{ uri: src.urls.regular }} />
    </ScrollView>
  }

  render() {
    const { host, src, dimensions: { width: screenWidth }, padding, radius, lightbox, onPress } = this.props;
    const { color, width: imageWidth, height: imageHeight, urls: { regular: imageURL } } = src;
    const targetWidth = screenWidth - padding * 2;
    const targetHeight = targetWidth / imageWidth * imageHeight;
    const Component = lightbox ? Lightbox : TouchableHighlight;
    return <Component style={{ marginLeft: padding, marginRight: padding }} underlayColor="transparent" springConfig={{ tension: 50, friction: 10 }} renderContent={() => this.renderFullscreen(src)} onPress={() => onPress(src)}>
      <ProgressiveImage host={host} width={targetWidth} height={targetHeight} bg={color} radius={radius} uri={imageURL} />
    </Component>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
