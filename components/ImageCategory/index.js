
import React, { Component } from 'react';
import { View, Text, StyleSheet, InteractionManager } from 'react-native';

import Touchable from 'px/components/Touchable';

export default class ImageCategory extends Component {

  categories = [ 'latest', 'new', 'follow' ]

  renderCategory(category, i) {
    const name = `${category.charAt(0).toUpperCase()}${category.slice(1)}`.toUpperCase();
    return <Touchable key={i} style={[styles.column, styles.touchable, styles[category]]}>
      <View style={styles.row}>
        <Text style={styles.text}>{ name }</Text>
        { category === 'new' && <View style={styles.updates} /> }
      </View>
    </Touchable>
  }

  render() {
    const { categories } = this;
    return <View style={styles.base}>
      <View style={styles.column} />
      <View style={styles.column} />
      { categories.map( (category, i) => this.renderCategory(category, i) ) }
      <View style={styles.column} />
      <View style={styles.column} />
    </View>;
  }

}

const styles = StyleSheet.create({
  base: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowRadius: .5,
    shadowOpacity: 1,
    shadowColor: '#444',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    paddingTop: 10,
    paddingBottom: 5,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    height: 20,
  },
  row: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  touchable: {
    flex: 1.5,
  },
  text: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9ca0a9',
    letterSpacing: .5,
  },
  updates: {
    marginTop: 2,
    backgroundColor: '#FD6D89',
    height: 4,
    width: 4,
    borderRadius: 2,
  },
  latest: {
    alignItems: 'flex-end',
  },
  collections: {
    alignItems: 'flex-start',
  },
});

