
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { LazyloadView } from 'react-native-lazyload';

import Touchable from 'px/components/Touchable';
import ProgressiveTransitionImage from 'px/components/ProgressiveTransitionImage';

export default class ImageDisplay extends Component {

  static defaultProps = {
    host: '',
    route: '',
    src: { },
    dimensions: {
      width: 0,
      height: 0,
    },
    padding: 0,
    radius: 0,
    onPress: () => { },
  }

  static propTypes = {
    host: React.PropTypes.string,
    route: React.PropTypes.string,
    src: React.PropTypes.object,
    dimensions: React.PropTypes.shape({
      width: React.PropTypes.number,
      height: React.PropTypes.number,
    }),
    padding: React.PropTypes.number,
    radius: React.PropTypes.number,
    onPress: React.PropTypes.func,
  }

  render() {
    const { host, route, src, dimensions: { width: screenWidth }, padding, radius, onPress } = this.props;
    const { color, width: imageWidth, height: imageHeight, urls: { regular: imageURL } } = src;
    const targetWidth = screenWidth - padding * 2;
    const targetHeight = targetWidth / imageWidth * imageHeight;
    return <Touchable style={{ marginLeft: padding, marginRight: padding }} underlayColor="transparent" onPress={() => onPress(src)}>
      <ProgressiveTransitionImage name={src.id} route={route} source={{ uri: src.urls.regular }} wrapper={LazyloadView} mask={true} options={{ host, style: { width: targetWidth, height: targetHeight }}} style={{ width: targetWidth, height: targetHeight, borderRadius: radius }} containerStyle={{ width: targetWidth, height: targetHeight, backgroundColor: src.color, borderRadius: radius }} />
    </Touchable>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
