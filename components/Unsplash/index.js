
import React, { Component } from 'react';
import Unsplash, { toJson } from 'unsplash-js';

import mock from 'px/mock';
import config from 'px/config';

const defaults = {
  applicationId: '',
  secret: '',
  callbackUrl: '',
  bearerToken: '',
};

const options = {
  applicationId: config.unsplash_appid,
  secret: config.unsplash_secret,
};

const client = new Unsplash({
  ...defaults,
  ...options,
});

const unsplash = { };
for (const key in client) {
  const wrappers = { };
  const apisCategory = client[key];
  const mockCategory = mock[key] || { };
  if (typeof apisCategory !== 'object' || apisCategory === null) continue;
  for (const key in apisCategory) {
    const apiMethod = apisCategory[key];
    const mockData = mockCategory[key];
    if (typeof apiMethod !== 'function') continue;
    wrappers[key] = function(...args) {
      if ( __DEV__ && mockData) {
        return new Promise(resolve => resolve(mockData));
      }
      return apiMethod(...args).then(toJson);
    }
  }
  unsplash[key] = wrappers;
}

export default class Wrapper extends Component {

  static childContextTypes = {
    unsplash: React.PropTypes.object,
  }

  getChildContext() {
    return {
      unsplash,
    };
  }

  render() {
    const { children } = this.props;
    return children;
  }

}
