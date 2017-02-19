
import React, { Component } from 'react';
import { Alert, ActionSheetIOS, Platform, InteractionManager } from 'react-native';

export class ActionMenu extends Component {

  static defaultProps = {
    id: '',
    text: '',
    highlight: false,
    onPress: () => { },
  }

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    highlight: React.PropTypes.bool,
    onPress: React.PropTypes.func,
  }

  render() {
    return null
  }

}

export default class ActionSheet extends Component {

  static defaultProps = {
    title: undefined,
    message: undefined,
    children: null,
    onCancel: () => { },
  }

  static propTypes = {
    title: React.PropTypes.string,
    message: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.element,
      React.PropTypes.arrayOf(React.PropTypes.element),
    ]),
    onCancel: React.PropTypes.func,
  }

  menus() {
    const { children } = this.props;
    return (Array.isArray(children) ? children : [children])
      .filter(n => n)
      .filter(n => n.type === ActionMenu)
      .map(o => o.props);
  }

  show(options = { }) {
    InteractionManager.runAfterInteractions(() => {
      const items = this.menus();
      const { title, message, onCancel } = this.props;
      switch ( Platform.OS ) {
        case 'ios':
          let highlight;
          for ( const [ idx, item ] of items.entries() ) {
            if ( item.highlight ) highlight = idx;
          }
          return ActionSheetIOS.showActionSheetWithOptions({
            options: [ ...items.map(item => item.text), 'Cancel' ],
            cancelButtonIndex: items.length,
            destructiveButtonIndex: highlight,
            title,
            message,
          }, idx => {
            const item = items[idx];
            if ( item ) {
              item.onPress(item.id, options);
            } else {
              onCancel(options);
            }
          });
        case 'android':
          return Alert.alert(
            !title && !message ? ' ' : title,
            message,
            items,
          );
      }
    });
  }

  render() {
    return null
  }

}
