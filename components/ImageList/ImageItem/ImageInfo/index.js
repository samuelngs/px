
import React, { Component } from 'react';
import { View, Text, Image, TouchableHighlight, StyleSheet } from 'react-native';
import Moment from 'moment';

import ProgressiveImage from 'px/components/ProgressiveImage';
import Options from 'px/assets/icons/options.png';

export default class ImageInfo extends Component {

  static defaultProps = {
    host: '',
    src: { },
    dimensions: {
      width: 0,
      height: 0,
    },
    padding: 0,
    onAuthorPress: () => { },
    onMenuPress: () => { },
  }

  static propTypes = {
    host: React.PropTypes.string,
    src: React.PropTypes.object,
    dimensions: React.PropTypes.shape({
      width: React.PropTypes.number,
      height: React.PropTypes.number,
    }),
    padding: React.PropTypes.number,
    onAuthorPress: React.PropTypes.func,
    onMenuPress: React.PropTypes.func,
  }

  renderAvatar() {
    const { host, src: { user: { profile_image: { medium: avatarURL } } } } = this.props;
    return <ProgressiveImage host={host} radius={15} width={30} height={30} bg="#eee" uri={avatarURL} />
  }

  renderDescription() {
    const { src: { user: { location }, created_at: createdAt } } = this.props;
    if ( typeof location === 'string' && location.trim().length > 0 ) {
      return <Text style={styles.desc}>{ location }</Text>
    }
    if ( typeof createdAt === 'string' && createdAt.length > 0 ) {
      return <Text style={styles.desc}>{ Moment(createdAt).fromNow() }</Text>
    }
    return null;
  }

  render() {
    const { host, src, padding, onAuthorPress, onMenuPress } = this.props;
    const { user: { name, profile_image: { medium: avatarURL } } } = src;
    const paddingUnit = padding > 10 ? padding : 10;
    return <View style={[styles.base, { paddingLeft: paddingUnit, paddingRight: paddingUnit }]}>
      <ProgressiveImage host={host} radius={15} width={30} height={30} bg="#eee" uri={avatarURL} />
      <TouchableHighlight style={styles.fill} underlayColor="transparent" onPress={() => onAuthorPress(src)}>
        <View style={styles.details}>
          <Text style={styles.name}>{ name }</Text>
          { this.renderDescription() }
        </View>
      </TouchableHighlight>
      <TouchableHighlight style={styles.option} underlayColor="transparent" onPress={() => onMenuPress(src)}>
        <Image style={styles.option} source={Options} />
      </TouchableHighlight>
    </View>
  }

}

const styles = StyleSheet.create({
  base: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  fill: {
    flex: 1,
    flexDirection: 'row',
  },
  details: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
  },
  name: {
    fontSize: 14,
    color: '#555',
  },
  desc: {
    fontSize: 10,
    fontWeight: '500',
  },
  option: {
    width: 26,
    height: 26,
  },
});


