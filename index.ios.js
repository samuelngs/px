
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import Navigation from './components/Navigation';
import Controller from './components/Controller';

import NavigationLogo from './components/NavigationLogo';
import NavigationMenu from './components/NavigationMenu';
import NavigationSearch from './components/NavigationSearch';

import Home from './ui/Home';
import Photo from './ui/Photo';

export default class px extends Component {

  render() {
    return (
      <Navigation>
        <Controller id="home" title={<NavigationLogo />} leftButton={<NavigationMenu />} rightButton={<NavigationSearch />} component={Home} />
        <Controller id="photo" title="Photo" component={Photo} />
      </Navigation>
    );
  }
}

AppRegistry.registerComponent('px', () => px);
