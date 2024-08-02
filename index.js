import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { AppRegistry, Platform, LogBox, UIManager } from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotifService from './Src/services/notifService';
import {SetNotification} from './Src/redux/actions/actions';
import getStore from './Src/redux';
import SplashScreen from './Src/Screens/Splash/SplashScreen';

LogBox.ignoreAllLogs(true);

const store = getStore();

if (Platform.OS === 'android') {
  UIManager?.setLayoutAnimationEnabledExperimental?.(true);
}

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: async function (token) {
    console.log('TOKEN:', token);
    try {
      await AsyncStorage.setItem('device_token', token.token);
    } catch (e) {
      console.log('error saving device token in async storage');
    }
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    // console.log('NOTIFICATION:', notification);
    NotifService.setLatestNotificationData(notification);
    store.dispatch(SetNotification(notification));
    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: false,
});

const ProvidedApp = () => {
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return <SplashScreen onLoaded={() => setSplashVisible(false)} />;
  }

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
const log = console.log
export function logger(...args){
  log(args);
}
console.log = ()=>{}
AppRegistry.registerComponent(appName, () => ProvidedApp);
