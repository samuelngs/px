
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  base: {
    backgroundColor: '#FEFEFE',
    shadowRadius: .5,
    shadowOpacity: 1,
    shadowColor: '#666',
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  baseTranslucent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  baseTransparent: {
    backgroundColor: 'transparent',
  },
  baseBorderless: {
    shadowRadius: 0,
    shadowOpacity: 0,
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
});
