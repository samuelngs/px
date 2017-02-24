
import React from 'react';

import {
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
} from 'react-native';

function TouchableWithoutFeedback (props) {
  return <TouchableOpacity activeOpacity={1} focusedOpacity={1} { ...props } />
}

const Touchable = Platform.select({
  ios: () => TouchableWithoutFeedback,
  android: () => TouchableNativeFeedback,
})();

export default Touchable;
