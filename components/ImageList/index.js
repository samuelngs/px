
import React, { Component } from 'react';
import { View, Text, ListView, TouchableHighlight, StyleSheet, Dimensions, InteractionManager } from 'react-native';
import { LazyloadListView } from 'react-native-lazyload';

import ImageItem from './ImageItem';

import offset from './offset';

export default class ImageList extends Component {

  static defaultProps = {
    id : 'image-list',
    images: [ ],
    showsScrollIndicator: true,
    padding: 0,
    radius: 0,
    offset: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    lightbox: false,
    onImagePress: () => { },
    onMenuPress: () => { },
    onAuthorPress: () => { },
  }

  static propTypes = {
    id: React.PropTypes.string,
    images: React.PropTypes.array.isRequired,
    showsScrollIndicator: React.PropTypes.bool,
    padding: React.PropTypes.number,
    radius: React.PropTypes.number,
    offset: React.PropTypes.shape({
      top: React.PropTypes.number,
      bottom: React.PropTypes.number,
      left: React.PropTypes.number,
      right: React.PropTypes.number,
    }),
    lightbox: React.PropTypes.bool,
    onImagePress: React.PropTypes.func,
    onMenuPress: React.PropTypes.func,
    onAuthorPress: React.PropTypes.func,
  }

  state = {
    dimensions: {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    },
    dataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    }),
  }

  initialDataSource(images) {
    const { dataSource } = this.state;
    return this.setState({ dataSource: dataSource.cloneWithRows(images) });
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const { images } = this.props;
      this.initialDataSource(images);
    });
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
      });
    });
  }

  renderRow(src) {
    const { id, padding, radius, lightbox, onAuthorPress, onMenuPress, onImagePress } = this.props;
    const { dimensions } = this.state;
    return <ImageItem host={id} src={src} dimensions={dimensions} padding={padding} radius={radius} lightbox={lightbox} onAuthorPress={onAuthorPress} onMenuPress={onMenuPress} onImagePress={onImagePress} />
  }

  render() {
    const { dataSource } = this.state;
    const { id, images, showsScrollIndicator, offset: preLayoutOffset } = this.props;
    const layoutOffset = { top: 0, bottom: 0, left: 0, right: 0, ...preLayoutOffset };
    return <LazyloadListView
      name={id}
      stickyHeaderIndices={[]}
      contentContainerStyle={{ paddingBottom: layoutOffset.bottom }}
      initialListSize={images.length}
      onEndReachedThreshold={0}
      pageSize={0}
      renderScrollComponent={() => null}
      scrollRenderAheadDistance={100}
      style={[styles.container, { paddingTop: offset + layoutOffset.top }]}
      removeClippedSubviews={true}
      showsHorizontalScrollIndicator={showsScrollIndicator}
      showsVerticalScrollIndicator={showsScrollIndicator}
      scrollIndicatorInsets={{ top: offset + layoutOffset.top, bottom: layoutOffset.bottom }}
      onLayout={(e) => this.componentLayoutUpdate(e)}
      dataSource={dataSource}
      renderRow={data => this.renderRow(data)}
    />
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});



