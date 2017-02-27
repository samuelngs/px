
import React, { Component } from 'react';
import { View, ListView, RefreshControl, StyleSheet, Dimensions, InteractionManager } from 'react-native';
import { LazyloadListView } from 'react-native-lazyload';

import ProgressView from 'px/components/ProgressView';
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
    children: null,
    onImagePress: () => { },
    onMenuPress: () => { },
    onAuthorPress: () => { },
    onRefresh: complete => complete(),
    onLoadMore: complete => complete(),
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
    children: React.PropTypes.element,
    onImagePress: React.PropTypes.func,
    onMenuPress: React.PropTypes.func,
    onAuthorPress: React.PropTypes.func,
    onRefresh: React.PropTypes.func,
    onLoadMore: React.PropTypes.func,
  }

  state = {
    refreshing: false,
    fetching: false,
    lock: true,
    dimensions: {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    },
    previousDimensions: {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    },
    dataSource: new ListView.DataSource({
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
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
    const { children } = this.props;
    if ( children ) {
      return this.setState({ dataSource: dataSource.cloneWithRowsAndSections({ images }) });
    }
    return this.setState({ dataSource: dataSource.cloneWithRows(images) });
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const { images } = this.props;
      this.initialDataSource(images);
      setTimeout(_ => this.state.lock = false, 1000);
    });
  }

  componentWillReceiveProps({ images, children }) {
    const { images: prevImages, children: prevChildren } = this.props;
    if (
        images.length !== prevImages.length
        || children === null && prevChildren !== null
        || children !== null && prevChildren === null
    ) {
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

  onRefresh() {
    const { refreshing } = this.state;
    const { onRefresh } = this.props;
    if ( refreshing ) return;
    this.setState({ refreshing: true });
    onRefresh(() => {
      this.setState({ refreshing: false });
    });
  }

  onLoadMore() {
    const { fetching, lock } = this.state;
    const { onLoadMore } = this.props;
    if ( fetching || lock ) return;
    this.setState({ fetching: true });
    onLoadMore(() => {
      this.setState({ fetching: false });
    });
  }

  renderRow(src) {
    const { id, route, padding, radius, onAuthorPress, onMenuPress, onImagePress } = this.props;
    const { dimensions } = this.state;
    return <ImageItem host={id} route={route} src={src} dimensions={dimensions} padding={padding} radius={radius} onAuthorPress={onAuthorPress} onMenuPress={onMenuPress} onImagePress={onImagePress} />
  }

  renderSectionHeader() {
    const { children } = this.props;
    return children;
  }

  renderFooter() {
    return <ProgressView style={{ paddingTop: 10 }} />
  }

  render() {
    const { refreshing, fetching, dataSource, dimensions } = this.state;
    const { id, images, showsScrollIndicator, offset: preLayoutOffset } = this.props;
    const layoutOffset = { top: 0, bottom: 0, left: 0, right: 0, ...preLayoutOffset };
    return <View style={[styles.base, { paddingTop: offset + layoutOffset.top, paddingBottom: layoutOffset.bottom }]}>
      <LazyloadListView
        name={id}
        enableEmptySections={true}
        pageSize={images.length}
        dataSource={dataSource}
        initialListSize={images.length}
        stickyHeaderIndices={[]}
        style={styles.container}
        removeClippedSubviews={true}
        scrollRenderAheadDistance={300}
        showsHorizontalScrollIndicator={showsScrollIndicator}
        showsVerticalScrollIndicator={showsScrollIndicator}
        onLayout={(e) => this.componentLayoutUpdate(e)}
        renderScrollComponent={() => null}
        renderRow={data => this.renderRow(data)}
        renderSectionHeader={() => this.renderSectionHeader()}
        renderFooter={fetching ? () => this.renderFooter() : null}
        refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={() => this.onRefresh()}
        />}
        onEndReached={() => this.onLoadMore()}
        onEndReachedThreshold={100}
      />
    </View>
  }

}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

