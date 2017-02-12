
import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableHighlight, StyleSheet, Dimensions, InteractionManager } from 'react-native';

import offset from './offset';

const rowHeight = 200;
const rowInfoHeight = 54;

export default class ImageList extends Component {

  static defaultProps = {
    images: [ ],
    showsScrollIndicator: true,
    radius: 0,
    offset: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    onPress: () => { },
  }

  static propTypes = {
    images: React.PropTypes.array.isRequired,
    showsScrollIndicator: React.PropTypes.bool,
    radius: React.PropTypes.number,
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

  renderInfo(src) {
    return <View style={styles.infoContainer}>
      <Image
        style={styles.avatar}
        source={{ uri: src.user.profile_image.medium }}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name}>{ src.user.name }</Text>
        <Text style={styles.location}>{ src.user.location || (src.user.likes > 0 && `liked ${src.user.likes} photos`) || src.created_at }</Text>
      </View>
    </View>
  }

  renderImage(src) {
    return <TouchableHighlight style={styles.image} underlayColor="transparent">
      <Image
        style={[styles.image, { backgroundColor: src.color }]}
        source={{ uri: src.urls.regular }}
        resizeMode="cover"
      />
    </TouchableHighlight>
  }

  renderRow(src, i) {
    return <View key={i} style={styles.item}>
      { this.renderInfo(src) }
      { this.renderImage(src) }
    </View>
  }

  render() {
    const { images, showsScrollIndicator, offset: preLayoutOffset } = this.props;
    const layoutOffset = { top: 0, bottom: 0, left: 0, right: 0, ...preLayoutOffset };
    return <ScrollView
      style={[styles.container, { paddingTop: offset + layoutOffset.top }]}
      removeClippedSubviews={true}
      showsHorizontalScrollIndicator={showsScrollIndicator}
      showsVerticalScrollIndicator={showsScrollIndicator}
      scrollIndicatorInsets={{ top: offset + layoutOffset.top, bottom: layoutOffset.bottom }}
      onLayout={(e) => this.componentLayoutUpdate(e)}
    >
      <View style={[ styles.wrapper, { paddingBottom: layoutOffset.bottom }]}>
        { images.map((image, i) => this.renderRow(image, i)) }
      </View>
    </ScrollView>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flexDirection: 'column',
  },
  item: {
  },
  infoContainer: {
    height: rowInfoHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  content: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 14,
    color: '#555',
  },
  location: {
    fontSize: 10,
    fontWeight: '500',
  },
  image: {
    height: 300,
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 10,
  },
});



