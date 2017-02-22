
import React from 'react';

import {
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

const Touchable = Platform.select({
  ios: () => TouchableWithoutFeedback,
  android: () => TouchableNativeFeedback,
})();

export default Touchable;
