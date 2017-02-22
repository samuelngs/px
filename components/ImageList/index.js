
import React, { Component } from 'react';
import { ListView, StyleSheet, Dimensions, InteractionManager } from 'react-native';
import { LazyloadListView } from 'react-native-lazyload';

import ImageItem from './ImageItem';

import offset from './offset';

export default class ImageList extends Component {

  static defaultProps = {
    id : 'image-list',
    route: '',
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
    onImagePress: () => { },
    onMenuPress: () => { },
    onAuthorPress: () => { },
  }

  static propTypes = {
    id: React.PropTypes.string,
    route: React.PropTypes.string,
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
    onImagePress: React.PropTypes.func,
    onMenuPress: React.PropTypes.func,
    onAuthorPress: React.PropTypes.func,
  }

  state = {
    dimensions: {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    },
    previousDimensions: {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    },
    dataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        const {
          dimensions: { width: cw, height: ch },
          previousDimensions: { width: pw },
        } = this.state;
        return r1.id !== r2.id || cw !== pw;
      },
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
    const { images: prevImages } = this.props;
    if ( images.length !== prevImages.length ) {
      this.initialDataSource(images);
    }
  }

  componentLayoutUpdate(e) {
    InteractionManager.runAfterInteractions(() => {
      const { images } = this.props;
      const { dimensions: previousDimensions } = this.state;
      const { height, width } = Dimensions.get('window');
      const dimensions = {
        height,
        width,
      };
      return this.setState({
        dimensions,
        previousDimensions,
      }, () => this.initialDataSource(images));
    });
  }

  renderRow(src) {
    const { id, route, padding, radius, onAuthorPress, onMenuPress, onImagePress } = this.props;
    const { dimensions } = this.state;
    return <ImageItem host={id} route={route} src={src} dimensions={dimensions} padding={padding} radius={radius} onAuthorPress={onAuthorPress} onMenuPress={onMenuPress} onImagePress={onImagePress} />
  }

  render() {
    const { dataSource, dimensions } = this.state;
    const { id, images, showsScrollIndicator, offset: preLayoutOffset } = this.props;
    const layoutOffset = { top: 0, bottom: 0, left: 0, right: 0, ...preLayoutOffset };
    return <LazyloadListView
      name={id}
      stickyHeaderIndices={[]}
      enableEmptySections={true}
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

