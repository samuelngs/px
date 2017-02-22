
import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, TouchableHighlight } from 'react-native';

import ImageGrid from 'px/components/ImageGrid';
import ImageList from 'px/components/ImageList';
import ActionSheet, { ActionMenu } from 'px/components/ActionSheet';
import { SharedView } from 'px/components/Navigation';

import GridImage from 'px/assets/icons/grid.png';
import ListImage from 'px/assets/icons/list.png';

import NavigationLogo from 'px/components/NavigationLogo';
import NavigationMenu from 'px/components/NavigationMenu';
import NavigationSearch from 'px/components/NavigationSearch';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },
  actionBarButton: {
    height: 46,
    width: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBarImage: {
    height: 30,
    width: 30,
  },
});

export default class Home extends Component {

  static contextTypes = {
    unsplash: React.PropTypes.object,
  }

  static navigationOptions = {
    header: {
      title: <NavigationLogo />,
      left: <NavigationMenu />,
      right: <NavigationSearch />,
    },
    actionbar: {
      center: navigation => <TouchableHighlight style={styles.actionBarButton} underlayColor="transparent" onPress={() => {
        if ( !navigation.state.params ) {
          return navigation.setParams({ display: 'list' });
        }
        if ( !navigation.state.params.display ) {
          return navigation.setParams({ display: 'list' });
        }
        const { state: { params: { display } } } = navigation;
        navigation.setParams({ display: display === 'grid' ? 'list' : 'grid' })
      }}>
        <Image style={[styles.actionBarImage]} source={GridImage} />
      </TouchableHighlight>
    },
  }

  state = {
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

  onImagePressed(photo) {
    const { urls: { regular } } = photo;
    const { navigation: { navigate } } = this.props;
    return Image.prefetch(regular).then(() => {
      return navigate('photo', { photo });
    });
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
    const { photos } = this.state;
    const { navigation: { state: { routeName, params = { } } } } = this.props;
    const { display = 'grid' } = params;
    return <View style={styles.container}>
      { display === 'grid' && <ImageGrid route={routeName} images={photos} radius={2} columnGap={3} offset={{ bottom: 46 }} onPress={this.onImagePressed} /> }
      { display === 'list' && <ImageList route={routeName} images={photos} padding={0} radius={0} listGap={3} offset={{ bottom: 46 }} onAuthorPress={this.onAuthorPressed} onMenuPress={this.onMenuPressed} onImagePress={this.onImagePressed} /> }
      <ActionSheet ref={n => this.as = n} onCancel={this.onActionMenuCancelled}>
        <ActionMenu id="share" text="Copy Share URL" onPress={this.onActionMenuPressed} />
        <ActionMenu id="wallpaper" text="Set As Wallpaper" onPress={this.onActionMenuPressed} />
        <ActionMenu id="download" text="Download" highlight={true} onPress={this.onActionMenuPressed} />
      </ActionSheet>
      { false && <ActionBar
        center={<TouchableHighlight style={styles.actionBarButton} underlayColor="transparent" onPress={() => this.onToggleDisplay()}>
          <Image style={[styles.actionBarImage]} source={display === 'grid' ? GridImage : ListImage} />
        </TouchableHighlight>}
      /> }
    </View>
  }

}

