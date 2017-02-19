
import React, { Component } from 'react';
import { View, Image, ScrollView, TouchableHighlight, StyleSheet, Dimensions, InteractionManager } from 'react-native';
import Lightbox from 'react-native-lightbox';

import { LazyloadScrollView } from 'react-native-lazyload';
import ProgressiveImage from 'px/components/ProgressiveImage';

import offset from './offset';

const suggestColumnWidth = 200;

export default class ImageGrid extends Component {

  static defaultProps = {
    id : 'image-grid',
    images: [ ],
    maxColumnWidth: 250,
    minColumnCount: 2,
    maxColumnCount: 3,
    columnGap: 4,
    showsScrollIndicator: true,
    radius: 0,
    lightbox: false,
    offset: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    onPress: () => { },
  }

  static propTypes = {
    id: React.PropTypes.string,
    images: React.PropTypes.array.isRequired,
    maxColumnWidth: React.PropTypes.number,
    minColumnCount: React.PropTypes.number,
    maxColumnCount: React.PropTypes.number,
    columnGap: React.PropTypes.number,
    showsScrollIndicator: React.PropTypes.bool,
    radius: React.PropTypes.number,
    lightbox: React.PropTypes.bool,
    offset: React.PropTypes.shape({
      top: React.PropTypes.number,
      bottom: React.PropTypes.number,
      left: React.PropTypes.number,
      right: React.PropTypes.number,
    }),
    onPress: React.PropTypes.func,
  }

  state = {
    dimensions: {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    },
    dataSources: [ ],
  }

  componentWillReceiveProps({ images }) {
    this.initialDataSource(images);
  }

  componentLayoutUpdate(e) {
    InteractionManager.runAfterInteractions(() => {
      const { images } = this.props;
      const { height, width } = Dimensions.get('window');
      const dimensions = {
        height,
        width,
      };
      return this.setState({
        dimensions,
      }, () => this.initialDataSource(images));
    });
  }

  initialDataSource(images) {
    const { minColumnCount, maxColumnCount } = this.props;
    const { dimensions: { width }, dataSources: predataSource } = this.state;
    const count = Math.floor(width / suggestColumnWidth);
    const columns = count >= minColumnCount ? (count > maxColumnCount ? maxColumnCount : count ) : minColumnCount;
    const sources = [ ...Array(columns) ].map(_ => []);
    const dataSources = [ ...predataSource ];
    let pos = 0;
    for ( const [ index, value ] of images.entries() ) {
      sources[ pos ].push(value);
      pos++;
      if ( pos >= columns ) {
        pos = 0;
      }
    }
    for ( let i = columns; i < dataSources.length; i++ ) {
      dataSources.splice(i, 1);
    }
    for ( const [ index, source ] of sources.entries() ) {
      dataSources[index] = source;
    }
    return this.setState({ dataSources });
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

  renderImage(src, i, imageWidth) {
    const { id, columnGap, radius, lightbox, onPress } = this.props;
    const height = imageWidth / src.width * src.height;
    const Component = lightbox ? Lightbox : TouchableHighlight;
    return <Component key={ i } style={{ width: imageWidth, height, margin: columnGap }} underlayColor="transparent" springConfig={{ tension: 50, friction: 10 }} renderContent={() => this.renderFullscreen(src)} onPress={() => onPress(src)}>
      <ProgressiveImage host={id} width={imageWidth} height={height} radius={radius} bg={src.color} uri={src.urls.small} />
    </Component>
  }

  renderColumn(ds, i, columnWidth, imageWidth) {
    return <View key={i} style={[styles.column, { width: columnWidth }]}>
      { ds.map((src, i) => this.renderImage(src, i, imageWidth)) }
    </View>
  }

  render() {
    const { id, maxColumnWidth, columnGap, showsScrollIndicator, offset: preLayoutOffset } = this.props;
    const layoutOffset = { top: 0, bottom: 0, left: 0, right: 0, ...preLayoutOffset };
    const { dimensions: { width }, dataSources } = this.state;
    const avgColumnWidth = width / dataSources.length;
    const actlColumnWidth = (avgColumnWidth > maxColumnWidth ? maxColumnWidth : avgColumnWidth) - columnGap;
    const actlImageWidth = actlColumnWidth - columnGap * 2;
    return <LazyloadScrollView
      name={id}
      style={[styles.container, { paddingTop: offset + columnGap + layoutOffset.top }]}
      removeClippedSubviews={true}
      showsHorizontalScrollIndicator={showsScrollIndicator}
      showsVerticalScrollIndicator={showsScrollIndicator}
      scrollIndicatorInsets={{ top: offset + columnGap + layoutOffset.top, bottom: columnGap + layoutOffset.bottom }}
      onLayout={(e) => this.componentLayoutUpdate(e)}
    >
      <View style={[ styles.wrapper, { marginRight: columnGap, marginLeft: columnGap, paddingBottom: columnGap * 2 + layoutOffset.bottom }]}>
        { dataSources.map((ds, i) => this.renderColumn(ds, i, actlColumnWidth, actlImageWidth)) }
      </View>
    </LazyloadScrollView>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
});


