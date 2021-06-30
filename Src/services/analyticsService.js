import analytics, { firebase } from '@react-native-firebase/analytics';
    
class Analytics {
  static init() {
      analytics().setAnalyticsCollectionEnabled(true);
  }

  static setupUserID = async userID => {
    await  analytics().setUserId(userID)
  };

  static setupUserName = async userName => {

    await analytics().setUserProperties({"userName": userName});
  };

  static setCurrentScreen = async screenName => {

    await analytics().logScreenView({screen_name : screenName})
  };

  static logEvents = async (eventName, propertyObject = {}) => {

    await analytics().logEvent(eventName, propertyObject);
  }
}

export default Analytics;