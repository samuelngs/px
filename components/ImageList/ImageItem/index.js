
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import ImageInfo from './ImageInfo';
import ImageDisplay from './ImageDisplay';
import ImageActionBar from './ImageActionBar';

export default class ImageItem extends Component {

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
    onImagePress: () => { },
    onMenuPress: () => { },
    onAuthorPress: () => { },
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
    onImagePress: React.PropTypes.func,
    onMenuPress: React.PropTypes.func,
    onAuthorPress: React.PropTypes.func,
  }

  render() {
    const { host, route, src, dimensions, padding, radius, onAuthorPress, onMenuPress, onImagePress } = this.props;
    return <View style={styles.base}>
      <ImageDisplay host={host} route={route} src={src} dimensions={dimensions} padding={padding} radius={radius} onPress={onImagePress} />
      <ImageInfo host={host} route={route} src={src} dimensions={dimensions} padding={padding} onAuthorPress={onAuthorPress} onMenuPress={onMenuPress} />
      <ImageActionBar host={host} route={route} src={src} dimensions={dimensions} padding={padding} />
    </View>
  }

}

const styles = StyleSheet.create({
  base: {
    marginBottom: 14,
    shadowRadius: 0,
    shadowOpacity: 1,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    backgroundColor: '#fff',
  },
});
