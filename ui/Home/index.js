
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
          return navigation.setParams({ display: 'grid' });
        }
        if ( !navigation.state.params.display ) {
          return navigation.setParams({ display: 'grid' });
        }
        const { state: { params: { display } } } = navigation;
        navigation.setParams({ display: display === 'grid' ? 'list' : 'grid' })
      }}>
        <Image style={[styles.actionBarImage]} source={navigation.state.params && navigation.state.params.display === 'grid' ? GridImage : ListImage} />
      </TouchableHighlight>
    },
    statusbar: {
      barStyle: 'dark-content',
    },
  }

  state = {
    page: 1,
    type: 'latest',
    photos: [ ],
  }

  constructor(props) {
    super(props);
    this.onAuthorPressed = this.onAuthorPressed.bind(this);
    this.onMenuPressed = this.onMenuPressed.bind(this);
    this.onImagePressed = this.onImagePressed.bind(this);
    this.onActionMenuPressed = this.onActionMenuPressed.bind(this);
    this.onActionMenuCancelled = this.onActionMenuCancelled.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

  fetch(complete) {
    const { unsplash } = this.context;
    const { page, type, photos } = this.state;
    unsplash
      .photos
      .listPhotos(page, 30, type)
      .then(images => {
        if ( page === 1 ) {
          return this.setState({ photos: images });
        }
        return this.setState({ photos: [ ...photos, ...images ] });
      })
      .then(_ => {
        if ( typeof complete === 'function' ) {
          complete();
        }
      });
  }

  onRefresh(complete) {
    this.setState({ page: 1 }, () => this.fetch(complete));
  }

  onLoadMore(complete) {
    const { page: prev } = this.state;
    const page = prev + 1;
    this.setState({ page }, () => this.fetch(complete));
  }

  onImagePressed(photo) {
    const { id, urls: { regular } } = photo;
    const { navigation: { navigate } } = this.props;
    const { unsplash } = this.context;
    Promise.all([
      unsplash
        .photos
        .getPhoto(id),
      Image
        .prefetch(regular),
    ]).then(([ details, prefetch ]) => {
      return navigate('photo', {
        photo,
        details,
      });
    }).catch(err => {
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
    const { display = 'list' } = params;
    return <View style={styles.container}>
      { display === 'grid' && <ImageGrid route={routeName} images={photos} radius={2} columnGap={3} offset={{ bottom: 46 }} onPress={this.onImagePressed} /> }
      { display === 'list' && <ImageList route={routeName} images={photos} padding={0} radius={0} listGap={3} offset={{ bottom: 46 }} onAuthorPress={this.onAuthorPressed} onMenuPress={this.onMenuPressed} onImagePress={this.onImagePressed} onRefresh={this.onRefresh} onLoadMore={this.onLoadMore} /> }
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

