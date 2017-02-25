
import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import Touchable from 'px/components/Touchable';

import ListItemLike from 'px/assets/icons/list_item_like.png';
import ListItemCollection from 'px/assets/icons/list_item_collection.png';
import ListItemShare from 'px/assets/icons/list_item_share.png';

export default class ImageActionBar extends Component {

  static defaultProps = {
    src: { },
  }

  static propTypes = {
    src: React.PropTypes.object,
  }

  render() {
    const { src: { likes } } = this.props;
    return <View style={styles.base}>
      <Touchable style={styles.button}>
        <View style={styles.horizontal}>
          <Image style={styles.icon} source={ListItemLike} />
          <Text style={styles.text}>{ likes } likes</Text>
        </View>
      </Touchable>
      <Touchable style={styles.button}>
        <View style={styles.horizontal}>
          <Image style={styles.icon} source={ListItemCollection} />
          <Text style={styles.text}>Collection</Text>
        </View>
      </Touchable>
      <View style={styles.fill} />
      <Touchable style={styles.button}>
        <View style={styles.horizontal}>
          <Image style={styles.icon} source={ListItemShare} />
          <Text style={styles.text}>Share</Text>
        </View>
      </Touchable>
    </View>
  }

}

const styles = StyleSheet.create({
  base: {
    height: 38,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
  fill: {
    flex: 1,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 38,
    justifyContent: 'center',
  },
  icon: {
    width: 12,
    height: 12,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9ca0a9',
  },
});
