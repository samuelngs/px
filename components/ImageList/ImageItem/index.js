
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import ImageInfo from './ImageInfo';
import ImageDisplay from './ImageDisplay';

export default class ImageItem extends Component {

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
    onImagePress: () => { },
    onMenuPress: () => { },
    onAuthorPress: () => { },
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
    onImagePress: React.PropTypes.func,
    onMenuPress: React.PropTypes.func,
    onAuthorPress: React.PropTypes.func,
  }

  render() {
    const { host, src, dimensions, padding, radius, lightbox, onAuthorPress, onMenuPress, onImagePress } = this.props;
    return <View style={styles.base}>
      <ImageInfo host={host} src={src} dimensions={dimensions} padding={padding} onAuthorPress={onAuthorPress} onMenuPress={onMenuPress} />
      <ImageDisplay host={host} src={src} dimensions={dimensions} padding={padding} radius={radius} lightbox={lightbox} onPress={onImagePress} />
    </View>
  }

}

const styles = StyleSheet.create({
  base: {
    marginBottom: 10,
  },
});
