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
  Button,
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
  SetNotification,
  SetShowWeeklyInsightsModal,
  SetWeeklyInsightsTimeLeft,
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
import PostRequestApi, {
  getDivisionName,
  GetStaffUserData,
} from './Src/apirequest/PostRequestApi';
import * as RootNavigation from './Src/navigator/RootNavigation';
import crashlytics from '@react-native-firebase/crashlytics';
import Analytics from './Src/services/analyticsService';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import messaging from '@react-native-firebase/messaging';
import { getIsInitialVideoVisible, onDynamicLinkUpdate, onUnlinkUpdate, setFitnessDataSync, setIsInitialVideoVisible, setMoodsArray } from './Src/services/commonService';
import Toast, { BaseToast } from 'react-native-toast-message';
import { getFontSize } from './Src/Constants/sizeChoose';
import Constants from './Src/Constants';
import CustomModal from './Src/Components/Modals/CustomModal/CustomModal';
import {
  defaultLocation,
  getLinkModalText,
  getWeeklyInsightsDaysLeft,
  isCountryIndia,
} from './Src/Constants/constants';
import {syncWeatherData} from './Src/Screens/Home/WeatherData/weatherService';
import WeeklyInsightsProgress from './Src/Components/Modals/WeeklyInsightsProgressModal/WeeklyInsightsProgressModal';
import { setSleepDataSync } from './Src/Screens/Home/SleepData/sleepDataService';
import Screen1 from './Src/Screens/WalkThrough/Screen1';
import BoardingNavigation from './Src/navigator/BoardingNavigation';
Number.prototype.format = function () {
  return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

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

const toastConfig = {
  error: ({ text2, ...rest }) => (
    <BaseToast
      {...rest}
      leadingIcon={Constants.Images.ErrorIcon}
      // style={{ borderLeftColor: 'pink' }}
      // contentContainerStyle={{ paddingHorizontal: 15 }}
      text2Style={styles.toastText}
      text2={text2}
    />
  ),
  info: ({ text2, ...rest }) => (
    <BaseToast
      {...rest}
      leadingIcon={Constants.Images.InfoIcon}
      // style={{ borderLeftColor: 'pink' }}
      // contentContainerStyle={{ paddingHorizontal: 15 }}
      text2Style={styles.toastInfoText}
      text2={text2}
    />
  ),
};

const App: () => React$Node = () => {
  const [screenName, setScreenName] = useState(false);
  const [ShowWelcome, setShowWelcome] = useState('');
  const notifService = useRef(new NotifService()).current;
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [email, setEmail] = useState('');
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [linkModalText, setLinkModalText] = useState('');
  const newOrg = useRef(null);

  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();

  useEffect(() => {
    Analytics.init();
    crashlytics().setCrashlyticsCollectionEnabled(true);
    return () => {
      RootNavigation.isReadyRef.current = false;
    };
  }, []);

  const linkCompany = useCallback(
    async (org) => {
      const deviceId = DeviceInfo.getUniqueId();
      let fcm = '';
      try {
        fcm = await messaging().getToken();
      } catch (error) {
        console.log('error getting fcm token');
      }
      if (!org) {
        org = newOrg.current;
      }
      if (typeof org === 'string' && deviceId && fcm) {
        console.log('handleDynamicLink org true: ', org);
        const params = {
          device_id: deviceId,
          user_id: org ?? newOrg.current,
          device_token: fcm,
          device_type: Platform.OS,
        };
        newOrg.current = null;
        console.log('getDownloadLink api params: ', params);
        try {
          const getDownloadLinkRes = await PostRequestApi('getDownloadLink', params);
          console.log('getDownloadLink api res: ', getDownloadLinkRes);
          let userData = null;
          if (
            !getDownloadLinkRes.data.staffData?.email &&
            getDownloadLinkRes?.data?.staffData === 'Not found'
          ) {
            // console.log('Showing Toast ====>');
            Toast.show({
              type: 'error',
              text2: 'Cannot link this device, please contact your HR manager',
              visibilityTime: 4000,
              autoHide: true,
            });
          } else if (
            getDownloadLinkRes?.data?.staffData &&
            getDownloadLinkRes?.data?.user_id
          ) {
            userData = {
              ...getDownloadLinkRes.data.staffData,
              user_id: getDownloadLinkRes.data.user_id,
            };
          }
          const currentRoute = RootNavigation.getCurrentRoute();
          if (
            currentRoute &&
            currentRoute.name === 'Linktocompany' &&
            userData?.email &&
            !userData?.division_id
          ) {
            RootNavigation?.getNavigationRef?.()?.current?.setParams?.({
              email: userData?.email,
            });
          }
          onDynamicLinkUpdate(userData, dispatch, function (data) {
            if (data !== false) {
              // data = {...data, division_id: null};
              if (data?.email && data?.division_id) {
                var raw = {
                  device_id: deviceId,
                  email: data.email,
                  user_id: data?.user_id,
                };
                getDivisionName(raw, dispatch, false);
                console.log('handleDynamicLink user Successfully Connected', data);
              } else if (data?.email && !data?.division_id) {
                console.log('Link success, please Select division - email', data.email);
                if (RootNavigation?.navigationRef?.current?.navigate) {
                  RootNavigation?.navigationRef?.current?.navigate(
                    'HomeScreen',
                    {
                      screen: 'LinkCompanyStackNavigation',
                      params: {
                        screen: 'Linktocompany',
                        params: {email: data.email},
                      },
                    },
                  );
                } else {
                  setEmail(data.email);
                }
              } else {
                console.log('Dynamic link onDynamicLinkUpdate onFinish else block');
              }
            }
          });
          console.log('getDownloadLink api res', getDownloadLinkRes);
          // })
        } catch (error) {
          console.log('error calling getDownloadLink api: ', error);
        }
      }
    }, [dispatch]);

  const onLinkConfirm = useCallback(async () => {
    setLinkModalText('');
    setIsLinkModalVisible(false);
    const showFailedTouUnlinkToast = () => {
      Toast.show({
        type: 'error',
        text2: 'Unlink company failed',
        visibilityTime: 4000,
        autoHide: true,
      });
    };
    let userEmail;
    let userId;
    try {
      let p = await AsyncStorage.getItem('Email');
      userEmail = await JSON.parse(p);
    } catch (error) {
      console.log('error getting email from Async storage');
    }
    try {
      let id = await AsyncStorage.getItem('UserId');
      userId = await JSON.parse(id);
    } catch (error) {
      console.log('error getting email from Async storage');
    }
    if (!userEmail || !userId) {
      showFailedTouUnlinkToast();
      newOrg.current = null;
      return;
    }
    const params = {
      email: userEmail,
      user_id: userId,
    };
    PostRequestApi('unlinkToCompany', params)
      .then(async (resp) => {
        const isDone = await onUnlinkUpdate(dispatch);
        console.log('unlinkToCompanyDone isDone =====', isDone);
        if (isDone) {
          linkCompany();
        } else {
          newOrg.current = null;
        }
      })
      .catch((err) => {
        showFailedTouUnlinkToast();
        newOrg.current = null;
        console.log('unlink api failed error: ', err);
      });
  }, [dispatch, linkCompany]);

  const onLinkCancel = useCallback(() => {
    setLinkModalText('');
    setIsLinkModalVisible(false);
    newOrg.current = null;
  }, []);

  const handleDynamicLink = async (link) => {
    let userEmail;
    let existingOrgName;
    try {
      let p = await AsyncStorage.getItem('Email');
      userEmail = await JSON.parse(p);
      existingOrgName = userEmail.split?.('@')?.pop?.().split?.('.')?.[0];
      // const modalText = getLinkModalText(company)
      // alert(`company - ${company}`);
    } catch (error) {
      console.log('error getting email from Async storage');
    }
    console.log('handleDynamicLink email: ', userEmail);
    // if (email && typeof email === 'string') {
    //   return;
    // }
    console.log('handleDynamicLink link: ', link);
    const url = link?.url;
    // const url = 'https://moodflo/org/Mzg=/n/aia';
    let org = url?.split?.("/org//")?.[1];
    const newOrgName = url?.split?.('/n/')?.pop?.();
    if (!org) {
      org = url?.split?.('/org/')?.pop?.()?.split?.('/n')?.[0];
    }
    console.log('org user id====', org);
    if (!newOrgName && email) {
      return;
    }
    if (
      org &&
      typeof org === 'string' &&
      newOrgName &&
      typeof newOrgName === 'string' &&
      existingOrgName &&
      typeof existingOrgName === 'string' &&
      newOrgName.toLowerCase() !== existingOrgName.toLowerCase()
    ) {
      const modalText = getLinkModalText(
        existingOrgName.toUpperCase(),
        newOrgName.toUpperCase(),
      );
      newOrg.current = org;
      setLinkModalText(modalText);
      setIsLinkModalVisible(true);
    } else if (!userEmail) {
      console.log('handleDynamicLink org: ', org);
      linkCompany(org);
    }
  };


  const goToSelectDivision = useCallback(() => {
    console.log('goToSelectDivision email: ', email);
    RootNavigation?.navigationRef?.current?.navigate('HomeScreen', {
      screen: 'LinkCompanyStackNavigation',
      params: {
        screen: 'Linktocompany',
        params: { email: email },
      },
    });
  }, [email]);

  const CheckScreen = async () => {
    let p = await AsyncStorage.getItem('ShowWelcomeScreen');
    let welcome = await JSON.parse(p);
    await setShowWelcome(welcome);
    console.log('welcome', welcome);
  };

  useEffect(() => {
    const getWelcomeScreen = async () => {
      try {
        let p = await AsyncStorage.getItem('ShowWelcomeScreen');
        let welcome = await JSON.parse(p);
        if (getIsInitialVideoVisible() === false && welcome == null) {
          setIsInitialVideoVisible(true);
        }
      } catch (error) {
        console.log('Error in get AsyncStorage ShowWelcomeScreen');
      }
    };
    getWelcomeScreen();
    const timeoutId = setTimeout(() => {
      SplashScreen.hide();
      clearTimeout(timeoutId);
    }, 2500);
    CheckScreen();
    if (ShowWelcome == null) {
      AsyncStorage.setItem('ShowWelcomeScreen', 'true');
      CheckScreen();
    } else {
      setShowWelcome(false);
    }
    PushNotification.popInitialNotification((notification) => {
      // console.log('popInitialNotification Notification: ', notification);
      dispatch(SetNotification(notification));
    });
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

  useEffect(() => {
    let isCurrentRoute = false;
    if (UserData.notification) {
      if (
        UserData.notification?.data?.question &&
        UserData.notification?.data?.id
      ) {
        // console.log(
        //   'Is it getting in here ======+++++++++=====+++++++++======+++++++++++====+++++++++++',
        // );
        // if (isUnmounted === false && isMoodDetectorScreenFocused === true) {
        //   setNotifData(notification);
        //   setIsNotificationQuestionModalVisible(true);
        // }
        // currentNotif = notification;
        const currentRoute = RootNavigation.getCurrentRoute();
        if (currentRoute && currentRoute.name !== 'MoodEmotionDetector') {
          isCurrentRoute = true;
          // console.log('----navigate to MoodEmotionDetector----');
          RootNavigation.navigate('MoodEmotionDetector');
        } else if (!currentRoute) {
          isCurrentRoute = true;
        }
      }
      UserData.notification?.id &&
        NotifService.cancelDeliveredNotifications([
          String(UserData.notification.id),
        ]);
      console.log('NOTIFICATION: App', UserData.notification);
      if (!isCurrentRoute) {
        // console.log('isCurrentRoute: App', isCurrentRoute);
        dispatch(SetNotification(null));
      }
    }
  }, [UserData.notification, dispatch]);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      NotifService.cancelMoodFloSheduledNotifications();
      dispatch(SetWeeklyInsightsTimeLeft(getWeeklyInsightsDaysLeft()));
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    // console.log("AppState", appState.current);
  };

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    NotifService.cancelMoodFloSheduledNotifications();
    dispatch(SetWeeklyInsightsTimeLeft(getWeeklyInsightsDaysLeft()));
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
    let Wp = await AsyncStorage.getItem('GiveWeatherPerm');
    
    let e = await JSON.parse(p);
    // let division = await JSON.parse(d);
    let WeatherP = await JSON.parse(Wp);
    let Id = await JSON.parse(UserId);
    let a = await JSON.parse(anonymous);
    // console.log(`e`, e);
    // console.log(`division`, division);
    // console.log(`HealthPerm`, HealthP);
    // console.log(`WeatherPerm`, WeatherP);
    // console.log(`LightPerm`, LightP);
    // console.log(`userId`, Id);
    // console.log(`Anonymous`, a, a === null ? true : a);

    //Health Permission
    let Hp = await AsyncStorage.getItem('GiveHealthPerm');
    let HealthP = await JSON.parse(Hp);
    dispatch(HealthPerm(HealthP));
    if (HealthP) {
      setFitnessDataSync(dispatch);
    }

    //Sleep Permission
    let SleepPer = await AsyncStorage.getItem('GiveSleepPerm');
    let SleepP = await JSON.parse(SleepPer); 
    dispatch(SleepPerm(SleepP));
    //Syncing Sleep Data
    if (Platform.OS === 'ios') {
      setSleepDataSync(dispatch, false);
    } else if (Platform.OS === 'android') {
      setSleepDataSync(dispatch);
    }
    // console.log(`Sleep Permission`, SleepP);
    dispatch(UserEmail(e));
    // dispatch(UserDivision(division));
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
      .catch((error) => {
        console.log('❌ ❌ ❌ ❌ Error Get Staff User Data ❌ ❌ ❌ ❌', error);
      });
    getDivisionName(raw, dispatch, true);
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
    UserData.WeatherPermission &&
      (UserData.lat == null || UserData.lon == null) &&
      GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 15000,
      })
        .then((location) => {
          //   console.log('Success', location);
          // setlat(location.latitude);
          const isIndia = isCountryIndia();
          if (isIndia) {
            location = {
              latitude: defaultLocation.latitude,
              longitude: defaultLocation.longitude
            };
          }
          console.log(
            '✅ ✅ ✅ ✅ Success GeoLocation Api ✅ ✅ ✅ ✅',
            JSON.stringify(location),
          );
          dispatch(Lat(location.latitude));
          // setlng(location.longitude);
          dispatch(Long(location.longitude));
        })
        .catch((error) => {
          const { code, message } = error;
          console.log('error getting lat lon from geolocation api', code, message);
        });
    UserData.AllMoods == null &&
      fetch('https://admin.moodflo.com/api/getMood')
        .then((data) => data.json())
        .then(async (res) => {
          // await setGetMoods(res.data);
          setMoodsArray(res?.data);
          await dispatch(Moods(res.data));
        })
        .catch((error) => {
          // const {code, message} = error;
          console.log('error', error);
        });
    checkStorage();
    getProfileUserData();
  }, [UserData.WeatherPermission]);

  useEffect(() => {
    // const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    dynamicLinks().getInitialLink().then(handleDynamicLink);
    // handleDynamicLink();
    // return () => unsubscribe();
    // return null;
  }, []);

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (
      (UserData.UserId && UserData.UserEmail) ||
      (!UserData.UserId && !UserData.UserEmail)
    ) {
      syncWeatherData();
    }
  }, [UserData.UserId, UserData.UserEmail]);

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
    if (email) {
      goToSelectDivision();
      const timeeoutIdTwo = setTimeout(() => {
        setEmail('');
        clearTimeout(timeeoutIdTwo);
      }, 500);
    }
  }, [email, goToSelectDivision]);

  const dismissWeeklyInsightsModal = () => {
    dispatch(SetShowWeeklyInsightsModal(false));
  };

  return (
    <>
      {ShowWelcome === false ? (
        <NavigationContainer
          ref={RootNavigation.navigationRef}
          onReady={onNavigationReady}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
              <StackNavigation />
            </View>
          </SafeAreaView>
          <Toast
            config={toastConfig}
            ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      ) : (
        <>
        <Screen1 onDone={_onDone}/>
          {/* <AppIntroSlider
            renderItem={renderItems}
            data={Images}
            onDone={_onDone}
            showSkipButton={true}
            onSkip={_onDone}
          /> */}
          <Toast
            config={toastConfig}
            ref={(ref) => Toast.setRef(ref)} />
        </>
      )}
      <CustomModal
        modalVisible={!!linkModalText && isLinkModalVisible}
        dismissModalHandler={onLinkCancel}
        modalText={linkModalText}
        onClickButtonOne={onLinkConfirm}
        buttonOneText="Unlink"
        onClickButtonTwo={onLinkCancel}
        buttonTwoText="Cancel"
      />
      <WeeklyInsightsProgress
        modalVisible={UserData.showWeeklyInsightsModal}
        verifyDone={dismissWeeklyInsightsModal}
        dismissModalHandler={dismissWeeklyInsightsModal}
      />
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
  toastText: {
    fontSize: getFontSize(15),
    color: '#B56873',
    fontWeight: 'bold',
  },
  toastInfoText: {
    fontSize: getFontSize(13),
    // color: '#9C9EB9',
    color: 'rgb(66,66,66)',
    // fontWeight: 'bold',
  },
});

export default App;
