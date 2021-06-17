import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  StatusBar,
  Text,
  ImageBackground,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  AppState,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage';
import {ScaledSheet} from 'react-native-size-matters';
import StackNavigation from './Src/navigator/StackNavigation';
import thunk from 'redux-thunk';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import allReducers from './Src/redux/reducers';
import ImageOne from './assets/OnBoarding/ImageOne';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-snap-carousel';
import One from './assets/OnBoarding/ImageOne.svg';
import {SvgCssUri, SvgUri, SvgXml} from 'react-native-svg';
import {
  GetUserId,
  HealthPerm,
  IsAnonymous,
  Lat,
  LightPerm,
  Long,
  Moods,
  SleepPerm,
  UserDetail,
  UserDivision,
  UserEmail,
  WeatherPerm,
} from './Src/redux/actions/actions';
import DeviceInfo from 'react-native-device-info';
import GetLocation from 'react-native-get-location';
import moment from 'moment';
// import LightSensor from 'react-native-light-sensor';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import NotifService from './Src/services/notifService';
import { getDivisionName, GetStaffUserData } from './Src/apirequest/PostRequestApi';
import * as RootNavigation from './Src/navigator/RootNavigation';

// const store = createStore(allReducers, applyMiddleware(thunk));
const {width: screenWidth} = Dimensions.get('window');

const slides = [
  {
    key: 1,
    title: `A multi species tournamet platform that fairly and accurately scores
    scores North America's most popular gamefish for local, regional, and
    International competition.`,
  },
  {
    key: 2,
    title: `A multi species tournamet platform that fairly and accurately scores
    scores North America's most popular gamefish for local, regional, and
    International competition.`,
  },
  {
    key: 3,
    title: `A multi species tournamet platform that fairly and accurately scores
    scores North America's most popular gamefish for local, regional, and
    International competition.`,
  },
];

const Images = [
  {
    key: "1",
    img: require('./assets/OnBoarding/Onboarding1.png'),
  },
  {
    key: "2",
    img: require('./assets/OnBoarding/Onboarding2.png'),
  },
  {
    key: "3",
    img: require('./assets/OnBoarding/Onboarding3.png'),
  },
  {
    key: "4",
    img: require('./assets/OnBoarding/Onboarding4.png'),
  },
];

const App: () => React$Node = () => {
  const [screenName, setScreenName] = useState(false);
  const [ShowWelcome, setShowWelcome] = useState('');
  const notifService = useRef(new NotifService()).current;
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      RootNavigation.isReadyRef.current = false;
    };
  }, []);

  const CheckScreen = async () => {
    let p = await AsyncStorage.getItem('ShowWelcomeScreen');
    let welcome = await JSON.parse(p);
    await setShowWelcome(welcome);
    console.log('welcome', welcome);
  };

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2500);
    CheckScreen();
    if (ShowWelcome == null) {
      AsyncStorage.setItem('ShowWelcomeScreen', 'true');
      CheckScreen();
    } else {
      setShowWelcome(false);
    }
    // CheckScreen();

    // try {
    //   let data = AsyncStorage.getItem('WelcomeScreen');
    //   if (data !== null) {
    //     setScreenName(true);
    //   } else {
    //     setScreenName(false);
    //   }
    // } catch (e) {
    //   console.warn(e);
    // }
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      NotifService.cancelMoodFloSheduledNotifications();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    // console.log("AppState", appState.current);
  };


  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    NotifService.cancelMoodFloSheduledNotifications();
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const checkStorage = async () => {
    // let anonymous = await AsyncStorage.getItem('Anonymous');
    // let a = await JSON.parse(anonymous);
    // if (a == null) {
    //   await AsyncStorage.setItem('Anonymous', 'true');
    // }
  };

  const getProfileUserData = async () => {
    let DateCheck = await AsyncStorage.getItem('DateCheck');
    let CheckForTodayDate = await JSON.parse(DateCheck);
    // console.log(`CheckForTodayDate ------ 1`, CheckForTodayDate);
    if (CheckForTodayDate === null) {
      // console.log(`date is set in storage for 1st time`);
      let aDay = moment().format('DD MMM YYYY');
      await AsyncStorage.setItem('DateCheck', JSON.stringify(aDay));
    }
    let DateCheckTwo = await AsyncStorage.getItem('DateCheck');
    let CheckForTodayDateTwo = await JSON.parse(DateCheckTwo);
    // console.log(`CheckForTodayDate ------ 2`, CheckForTodayDateTwo);
    let bDay = moment().format('DD MMM YYYY');
    // console.log(`Check for days ======> `, CheckForTodayDateTwo, bDay);
    if (CheckForTodayDateTwo !== bDay) {
      // console.log(`Date is confirmed sure And &&&&&&&& Mood is reset`);
      await AsyncStorage.setItem('DateCheck', JSON.stringify(bDay));
      AsyncStorage.setItem('MoodCount', JSON.stringify(0));
    }

    // await AsyncStorage.setItem('DateCheck', JSON.stringify(aDay));
    // let DateCheck = await AsyncStorage.getItem('DateCheck');
    // let CheckForTodayDate = await JSON.parse(DateCheck);
    // if(CheckForTodayDate === )
    // let bDay = moment().format('DD MMM YYYY');

    // ---> checking all the data in local storage
    await AsyncStorage.setItem('Anonymous', 'true');
    let UserId = await AsyncStorage.getItem('UserId');
    let anonymous = await AsyncStorage.getItem('Anonymous');
    let p = await AsyncStorage.getItem('Email');
    // let d = await AsyncStorage.getItem('Division');
    let Hp = await AsyncStorage.getItem('GiveHealthPerm');
    let Wp = await AsyncStorage.getItem('GiveWeatherPerm');
    let Lp = await AsyncStorage.getItem('GiveLightPerm');
   
    let e = await JSON.parse(p);
    // let division = await JSON.parse(d);
    let HealthP = await JSON.parse(Hp);
    let WeatherP = await JSON.parse(Wp);
    let Id = await JSON.parse(UserId);
    let a = await JSON.parse(anonymous);
    let LightP = await JSON.parse(Lp);
    // console.log(`e`, e);
    // console.log(`division`, division);
    // console.log(`HealthPerm`, HealthP);
    // console.log(`WeatherPerm`, WeatherP);
    // console.log(`LightPerm`, LightP);
    // console.log(`userId`, Id);
    // console.log(`Anonymous`, a, a === null ? true : a);

    //Sleep Permission
    let SleepPer = await AsyncStorage.getItem('GiveSleepPerm');
    let SleepP = await JSON.parse(SleepPer);
    dispatch(SleepPerm(SleepP));
    dispatch(LightPerm(LightP));
    // console.log(`Sleep Permission`, SleepP);
    dispatch(UserEmail(e));
    // dispatch(UserDivision(division));
    dispatch(HealthPerm(HealthP));
    dispatch(WeatherPerm(WeatherP));
    dispatch(GetUserId(Id));
    dispatch(IsAnonymous(a == null ? true : a));

    // ---> calling api for get user details
    const deviceId = DeviceInfo.getUniqueId();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = {
      device_id: deviceId,
      email: e,
      user_id: Id,
    };
    // var raw = JSON.stringify({
    //   device_id: deviceId,
    //   email: e,
    //   user_id: Id,
    // });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    GetStaffUserData(raw, dispatch)
      .then(async (result) => {
        // console.log(
        //   '✅ ✅ ✅ ✅ Success Get Staff User Data ✅ ✅ ✅ ✅',
        //   result?.userData
        // );
        if (result?.userData?.status !== 2) {
          await dispatch(UserDetail(result?.userData));
        }
      })
      .catch((error) => console.log('❌ ❌ ❌ ❌ Error Get Staff User Data ❌ ❌ ❌ ❌', error));
      getDivisionName(raw, dispatch);

  };

  const requestNotificationPermissions = async () => {
    notifService
      .requestPermissions()
      .then((e) => {
        console.log('requestNotificationPermissions: ', e);
        if (e.authorizationStatus !== 0) {
          fp();
        }
      })
      .catch((error) => {
        console.log('requestNotificationPermissions error: ', error);
      });
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      fp();
    } else {
      notifService.checkPermission((res) => {
        console.log('checkPermission data => ', res);
        if (res.authorizationStatus !== 0) {
          fp();
        } else {
          requestNotificationPermissions();
        }
      });
    }
  }, []);

  const fp = () => {
    notifService.scheduleMoodFloLocalNotif();
  };
  useEffect(() => {
    // console.log(`LightSensor`, LightSensor);
    {
      UserData.WeatherPermission &&
        (UserData.lat == null || UserData.lon == null) &&
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        })
          .then((location) => {
            //   console.log('Success', location);
            // setlat(location.latitude);
            console.log(
              '✅ ✅ ✅ ✅ Success GeoLocation Api ✅ ✅ ✅ ✅',
              JSON.stringify(location),
            );
            dispatch(Lat(location.latitude));
            // setlng(location.longitude);
            dispatch(Long(location.longitude));
          })
          .catch((error) => {
            const {code, message} = error;
            console.log('error getting lat lon from geolocation api', code, message);
          });
    }
    {
      UserData.AllMoods == null &&
        fetch('https://admin.moodflo.com/api/getMood')
          .then((data) => data.json())
          .then(async (res) => {
            // await setGetMoods(res.data);
            await dispatch(Moods(res.data));
          })
          .catch((error) => {
            // const {code, message} = error;
            console.log('error', error);
          });
    }
    checkStorage();
    getProfileUserData();
  }, [UserData.WeatherPermission]);

  const renderItems = ({item, index}, parallaxProps) => {
    // console.log('item', item.img);
    // console.log('ShowWelcome--', ShowWelcome);
    return (
      <>
        <View activeOpacity={0.8} style={styles.item}>
          <Image
            source={item.img}
            height={'100%'}
            width={'100%'}
            style={{height: '100%', width: '100%'}}
          />
        </View>
      </>
    );
  };

  const _onDone = async () => {
    await AsyncStorage.setItem('ShowWelcomeScreen', 'false');
    CheckScreen();
    try {
      await AsyncStorage.setItem('WelcomeScreen', 'false');
      setScreenName(true);
    } catch (e) {
      console.warn(e);
    }
  };

  const onNavigationReady = useCallback(() => {
    RootNavigation.isReadyRef.current = true;
  }, []);

  return (
    <>
      {/* {console.log('ShowWelcome--', ShowWelcome)} */}
      {/* <Provider store={store}> */}
      {ShowWelcome === false ? (
        <NavigationContainer
          ref={RootNavigation.navigationRef}
          onReady={onNavigationReady}
        >
          <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
              <StackNavigation />
            </View>
          </SafeAreaView>
        </NavigationContainer>
      ) : (
        <AppIntroSlider
          renderItem={renderItems}
          data={Images}
          onDone={_onDone}
          showSkipButton={true}
          onSkip={_onDone}
        />
      )}
      {/* </Provider> */}
    </>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  messageStyle: {
    color: 'white',
    fontSize: 16,
  },
  containerStyle: {
    backgroundColor: 'black',
    paddingBottom: 8,
  },
  errorStyle: {
    backgroundColor: 'red',
    paddingBottom: 8,
  },
  welcomeLogoStyle: {
    position: 'absolute',
    bottom: '15%',
    left: '50%',
    right: '50%',
    alignItems: 'center',
  },
  welcomeDotStyle: {
    backgroundColor: 'gray',
    height: '14@ms',
    width: '14@ms',
    borderRadius: '7@ms',
    borderColor: 'red',
    borderWidth: 1,
  },
  activeWelcomeDotStyle: {
    backgroundColor: 'red',
    height: '14@ms',
    width: '14@ms',
    borderRadius: '7@ms',
  },
  welcometextStyle: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
  },
  welcomeTextWrapper: {position: 'absolute', top: '15%', alignSelf: 'center'},
  welRenderWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: '25@ms',
  },
  welTitletext: {
    fontSize: 18,
    color: 'green',
    textAlign: 'center',
    fontWeight: '600',
  },
  sliderImage: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: '10@ms',
    marginLeft: 40,
  },
  sliderContentContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    // paddingHorizontal:15,
    // paddingVertical: '10@ms', // for custom animation
  },
});

export default App;
