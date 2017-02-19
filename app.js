
import React, { Component } from 'react';

import Unsplash from 'px/components/Unsplash';
import Navigation from 'px/components/Navigation';
import Controller from 'px/components/Controller';

import NavigationLogo from 'px/components/NavigationLogo';
import NavigationMenu from 'px/components/NavigationMenu';
import NavigationSearch from 'px/components/NavigationSearch';

import Home from 'px/ui/Home';
import Photo from 'px/ui/Photo';

export default class App extends Component {

  render() {
    return (
      <Unsplash>
        <Navigation borderless={true}>
          <Controller id="home" title={<NavigationLogo />} leftButton={<NavigationMenu />} rightButton={<NavigationSearch />} component={Home} />
          <Controller id="photo" title="Photo" component={Photo} />
        </Navigation>
      </Unsplash>
    );
  }
}
