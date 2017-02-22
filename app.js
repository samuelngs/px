
import React, { Component } from 'react';

import Unsplash from 'px/components/Unsplash';
import Navigation, { Controller } from 'px/components/Navigation';

import Home from 'px/ui/Home';
import Photo from 'px/ui/Photo';

export default class App extends Component {

  render() {
    return <Unsplash>
      <Navigation borderless={true}>
        <Controller id="home" component={Home} />
        <Controller id="photo" component={Photo} />
      </Navigation>
    </Unsplash>
  }
}
