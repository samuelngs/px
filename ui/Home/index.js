
import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, TouchableHighlight } from 'react-native';

import ImageGrid from 'px/components/ImageGrid';
import ImageList from 'px/components/ImageList';
import ActionBar from 'px/components/ActionBar';
import ActionSheet, { ActionMenu } from 'px/components/ActionSheet';

import GridImage from 'px/assets/icons/grid.png';
import ListImage from 'px/assets/icons/list.png';

export default class Home extends Component {

  static contextTypes = {
    unsplash: React.PropTypes.object,
  }

  state = {
    display: 'grid',
    photos: [ ],
  }

  constructor(props) {
    super(props);
    this.onAuthorPressed = this.onAuthorPressed.bind(this);
    this.onMenuPressed = this.onMenuPressed.bind(this);
    this.onImagePressed = this.onImagePressed.bind(this);
    this.onActionMenuPressed = this.onActionMenuPressed.bind(this);
    this.onActionMenuCancelled = this.onActionMenuCancelled.bind(this);
  }

  componentDidMount() {
    const { unsplash } = this.context;
    unsplash
      .photos
      .listPhotos(1, 30, 'latest')
      .then(photos => this.setState({ photos }));
  }

  onLeftButtonPressed() {
    console.log('Home left button pressed');
  }

  onRightButtonPressed() {
    console.log('Home right button pressed');
  }

  onPush() {
    const { navigator } = this.props;
    navigator.push('photo');
  }

  onToggleDisplay() {
    const { display } = this.state;
    switch ( display ) {
      case 'grid':
        return this.setState({ display: 'list' });
      case 'list':
        return this.setState({ display: 'grid' });
    }
  }

  onImagePressed(src) {
    const { unsplash } = this.context;
    const { id } = src;
    unsplash
      .photos
      .getPhoto(id)
      .then(json => {
        console.log('json obj', json);
      });
    console.log('image clicked', unsplash, src);
  }

  onAuthorPressed(src) {
    console.log('author clicked', src);
  }

  onMenuPressed(src) {
    const { as } = this;
    if ( !as ) return;
    as.show(src);
  }

  onActionMenuPressed(id, data) {
    console.log('action menu clicked', id, data);
  }

  onActionMenuCancelled() {
    console.log('action menu cancelled');
  }

  render() {
    const { display, photos } = this.state;
    return <View style={styles.container}>
      { display === 'grid' && <ImageGrid images={photos} radius={2} columnGap={3} offset={{ bottom: 46 }} onPress={this.onImagePressed} /> }
      { display === 'list' && <ImageList images={photos} padding={10} radius={3} lightbox={false} listGap={3} offset={{ bottom: 46 }} onAuthorPress={this.onAuthorPressed} onMenuPress={this.onMenuPressed} onImagePress={this.onImagePressed} /> }
      <ActionSheet ref={n => this.as = n} onCancel={this.onActionMenuCancelled}>
        <ActionMenu id="share" text="Copy Share URL" onPress={this.onActionMenuPressed} />
        <ActionMenu id="wallpaper" text="Set As Wallpaper" onPress={this.onActionMenuPressed} />
        <ActionMenu id="download" text="Download" highlight={true} onPress={this.onActionMenuPressed} />
      </ActionSheet>
      <ActionBar
        style={{ position: 'absolute', bottom: 0 }}
        left={<TouchableHighlight style={styles.actionBarButton} underlayColor="transparent" onPress={() => this.onToggleDisplay()}>
          <Image style={[styles.actionBarImage, { marginLeft: -5 }]} source={display === 'grid' ? GridImage : ListImage} />
        </TouchableHighlight>}
        right={null}
      />
    </View>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  actionBarButton: {
    height: 46,
    width: 46,
    justifyContent: 'center',
  },
  actionBarImage: {
    height: 30,
    width: 30,
  },
});

