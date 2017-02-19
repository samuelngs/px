
import React, { Component } from 'react';
import { TouchableHighlight } from 'react-native';

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
    onPress: React.PropTypes.func,
  }

  render() {
    const { host, src, dimensions: { width: screenWidth }, padding, radius, onPress } = this.props;
    const { color, width: imageWidth, height: imageHeight, urls: { regular: imageURL } } = src;
    const targetWidth = screenWidth - padding * 2;
    const targetHeight = targetWidth / imageWidth * imageHeight;
    return <TouchableHighlight style={{ marginLeft: padding, marginRight: padding }} underlayColor="transparent" onPress={() => onPress(src)}>
      <ProgressiveImage host={host} width={targetWidth} height={targetHeight} bg={color} radius={radius} uri={imageURL} />
    </TouchableHighlight>
  }

}

