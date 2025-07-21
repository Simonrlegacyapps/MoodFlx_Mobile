import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  Dimensions,
  Image,
  Platform,
  AppState,
  NativeModules,
  PermissionsAndroid,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScaledSheet } from 'react-native-size-matters';
import StackNavigation from './Src/navigator/StackNavigation';
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {
  Division,
  GetUserId,
  HealthPerm,
  IsAnonymous,
  Lat,
  Long,
  Moods,
  ResetLinkToCompanyParams,
  ScreenTimePerm,
  SetAvailableRewards,
  SetClaimedRewards,
  SetIsDivisionSelected,
  SetLocation,
  SetNegativeMoodModalData,
  SetNotification,
  SetShowMonthlyInsightsModal,
  SetShowWeeklyInsightsModal,
  SetWeeklyInsightsTimeLeft,
  SleepPerm,
  StandTimePerm,
  UserDetail,
  UserEmail,
  WeatherPerm,
} from './Src/redux/actions/actions';
import GetLocation from 'react-native-get-location';
import moment from 'moment';
// import LightSensor from 'react-native-light-sensor';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import NotifService from './Src/services/notifService';
import PostRequestApi, {
  getDivisionName,
  GetStaffUserData,
  getUpdateRewardPoint,
} from './Src/apirequest/PostRequestApi';
import Geocoder from 'react-native-geocoding';
import * as RootNavigation from './Src/navigator/RootNavigation';
import crashlytics from '@react-native-firebase/crashlytics';
import Analytics from './Src/services/analyticsService';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import messaging from '@react-native-firebase/messaging';
import {
  getIsInitialVideoVisible,
  getIsMoodLvlUp,
  getMyDeviceId,
  getUpdateAnswerRewardPoints,
  onDynamicLinkUpdate,
  onUnlinkUpdate,
  setDeviceId,
  setDivisionSetFlag,
  setFitnessDataSync,
  setIsInitialVideoVisible,
  setMoodsArray,
} from './Src/services/commonService';
import Toast, { BaseToast } from 'react-native-toast-message';
import { getFontSize } from './Src/Constants/sizeChoose';
import Constants from './Src/Constants';
import CustomModal from './Src/Components/Modals/CustomModal/CustomModal';
import {
  defaultLocation,
  defaultNegativeMoodModalData,
  getApiBaseUrl,
  getIsGetCurrentLocationCalled,
  getLinkModalText,
  getWeeklyInsightsDaysLeft,
  isCountryIndia,
  setIsDevServer,
  setIsGetCurrentLocationCalled,
  widgetDataGroup,
} from './Src/Constants/constants';
import { syncWeatherData } from './Src/Screens/Home/WeatherData/weatherService';
import WeeklyInsightsProgress from './Src/Components/Modals/WeeklyInsightsProgressModal/WeeklyInsightsProgressModal';
import { setSleepDataSync } from './Src/Screens/Home/SleepData/sleepDataService';
import Screen1 from './Src/Screens/WalkThrough/Screen1';
import BoardingNavigation from './Src/navigator/BoardingNavigation';
import getStore from './Src/redux';
import { useDispatch, useSelector } from 'react-redux';

const SharedStorage = NativeModules.SharedStorage;
import NoInternetModal from './Src/Components/Modals/NoInternetModal/NoInternetModal';
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import isEmpty from 'lodash.isempty';
import RNRestart from 'react-native-restart';
import MonthlyInsightsProgress from './Src/Components/Modals/MonthlyInsightsProgressModal/MonthlyInsightsProgressModal';
import LvlUpModal from './Src/Components/Modals/LvlUpModal/LvlUpModal';
import SetIsDevServerFlagModal from './Src/Components/Modals/SetIsDevServerFlagModal/SetIsDevServerFlagModal';
import { Linking } from 'react-native';
import Loader from './Src/Components/Loader/Loader';
import { logger } from '.';
import UpdateModal from './Src/Components/UpdateModal/UpdateModal';
import { checkAppVersion } from './Src/services/checkAppVersion';
import { AppPermissions } from './Src/services/appPermissions';

Number.prototype.format = function () {
  return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

// const store = createStore(allReducers, applyMiddleware(thunk));
const { width: screenWidth } = Dimensions.get('window');
messaging().registerDeviceForRemoteMessages();

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
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text2NumberOfLines={4}
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
      text2NumberOfLines={4}
      text2Style={styles.toastInfoText}
      text2={text2}
    />
  ),
};

const App = () => {

  const [ShowWelcome, setShowWelcome] = useState(false);
  const notifService = useRef(new NotifService()).current;
  const appState = useRef(AppState.currentState);
  const [email, setEmail] = useState('');
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [linkModalText, setLinkModalText] = useState('');
  const [link, setLink] = useState('');
  const [isOpenLvlUpModal, setIsOpenLvlUpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLinkLoader, setIsLinkLoader] = useState(false);
  const newOrg = useRef(null);
  const vitalityMemberId = useRef(null);
  const isHandleDynamicLinkCalled = useRef(false);
  const notifSchedulePreviousDay = useRef(null);
  const widgetData = useRef({
    "moodUpdateBody": {
      "anonymous": 1,
      "city": "",
      "country": "",
      "description": "mood input",
      "device_id": "",
      "device_token": "",
      "device_type": Platform.OS,
      "email": "",
      "lat": "",
      "lon": "",
      "mood_id": "",
      "mood_type": "regular",
      "reward_point": 0,
      "section_index": 4,
      "state": "",
      "user_id": ""
    }
  });

  const [isConnected, setIsConnected] = useState(true);
  const [updateModalAlert, setUpdateModalAlert] = useState(false);
  const netInfo = useNetInfo();
  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();



  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const permissionGranted = await AppPermissions.requestLocationPermission(dispatch);;
    if (permissionGranted) {
      console.warn('Location permission granted');
    } else {
      console.warn('Location permission denied');
    }
  };

  useEffect(() => {
    checkAppUpdate()
    setDeviceId();
    Analytics.init();
    crashlytics().setCrashlyticsCollectionEnabled(true);
    return () => {
      RootNavigation.isReadyRef.current = false;
    };
  }, []);

  useEffect(() => {
    logger("netinfo", netInfo)
    if (netInfo) {
      setIsConnected((e) => {
        const i = (netInfo.isConnected !== false || netInfo.isConnected === null) &&
          (netInfo.isInternetReachable !== false || netInfo.isInternetReachable === null);
        //let i = (netInfo.isConnected || netInfo.isConnected === null) && 
        //(netInfo.isInternetReachable || netInfo.isInternetReachable === null);
        if (e === false && i === true) {
          // Reload app to after internet comes back
          RNRestart?.Restart?.();
        }
        return i;
      });
    }
  }, [netInfo?.isConnected]);

  useEffect(() => {
    const setWidgetData = async () => {
      const userData = getStore?.()?.getState?.()?.First;
      const fcm = await messaging().getToken();
      Geocoder.init('AIzaSyD8BafHP8VtNFGyMg4uozFJcgsBaKDxS9s');
      let state_info = '';
      let city_info = '';
      let country_info = '';
      if (userData.lat && userData.lon) {
        await Geocoder.from({
          lat: userData.lat,
          lng: userData.lon,
        })
          .then((data) => {
            const address_list = data.results[0].address_components;
            for (let i = 0; i < address_list.length; i++) {
              if (address_list?.[i]?.types?.includes?.('country')) {
                country_info = address_list?.[i]?.long_name ?? '';
              }
              if (
                address_list?.[i]?.types?.includes?.(
                  'administrative_area_level_1',
                )
              ) {
                state_info = address_list?.[i]?.long_name ?? '';
              }
              if (
                address_list?.[i]?.types?.includes?.(
                  'administrative_area_level_2',
                )
              ) {
                city_info = address_list?.[i]?.long_name ?? '';
              }
            }
          })
          .catch((err) => console.log(`weather api location err`, err));
      }
      const isIndia = isCountryIndia();
      widgetData.current = {
        ...widgetData.current,
        moodUpdateBody: {
          ...widgetData.current.moodUpdateBody,
          mood_id: "",
          device_id: getMyDeviceId(),
          mood_type: "",
          city: isIndia && userData.WeatherPermission ? defaultLocation.city : city_info,
          state: isIndia && userData.WeatherPermission ? defaultLocation.state : state_info,
          country: isIndia && userData.WeatherPermission ? defaultLocation.country : country_info,
          lat: isIndia && userData.WeatherPermission ? defaultLocation.latitude : userData.lat,
          lon: isIndia && userData.WeatherPermission ? defaultLocation.longitude : userData.lon,
          email: userData.UserEmail ? userData.UserEmail : "",
          user_id: userData.UserId && !isNaN(userData.UserId) ? String(userData.UserId) : "",
          device_token: fcm,
          device_type: Platform.OS,
          anonymous: !userData.Anonymous ? 0 : 1,
          reward_point: 0,
          section_index: 4,
          description: 'mood input',
        },
      };
      if (Platform.OS === 'ios') {
        try {
          // iOS
          await SharedGroupPreferences.setItem('widgetKey', widgetData.current, widgetDataGroup);
          console.log('SharedGroupPreferences.setItem success ---->', widgetData.current);
        } catch (error) {
          console.log('SharedGropPrefences widgetKey error: ', error);
        }
      } else if (Platform.OS === 'android') {
        // Android
        SharedStorage.set(JSON.stringify(widgetData.current));
        console.log('SharedStorage.set success ---->', widgetData.current);
      }
    };
    if (
      ((UserData.UserId && UserData.UserEmail) ||
        (!UserData.UserId && !UserData.UserEmail)) &&
      ((UserData.lat && UserData.lon) ||
        (!UserData.lat && !UserData.lon))
    ) {
      setWidgetData();
    }
  }, [
    UserData.lat,
    UserData.lon,
    UserData.UserEmail,
    UserData.UserId,
    UserData.Anonymous,
  ]);

  const checkInternet = useCallback(() => {
    NetInfo.fetch().then(state => {
      console.log("Connection type", state?.type);
      console.log("Is connected?", state?.isConnected);
      setIsConnected(state.isConnected && state.isInternetReachable);
    });
  }, []);

  const linkCompany = async (org, vitality_member_id) => {

    setIsLinkLoader(true)
    const deviceId = getMyDeviceId();
    let fcm = '';

    try {
      fcm = await messaging().getToken();
    } catch (error) {
      const fcmToken = await NotifService.getDeviceToken();
      if (fcmToken) {
        fcm = fcmToken
      } else {
        console.log('error getting fcm token company link');
      }
    }
    if (!org) {
      org = newOrg.current;
    }
    if (!vitality_member_id) {
      vitality_member_id = vitalityMemberId.current;
    }
    if (typeof org === 'string' && deviceId && fcm) {
      console.log('handleDynamicLink org true: ', org);
      const params = {
        device_id: deviceId,
        user_id: org ?? newOrg.current,
        device_token: fcm,
        device_type: Platform.OS,
        vitality_member_id, // vitality memeber id from custom param dynamic link
      };
      newOrg.current = null;
      vitalityMemberId.current = null;
      logger('getDownloadLink api params: ', params);
      try {
        const getDownloadLinkRes = await PostRequestApi('v2/getDownloadLink', params);
        logger('getDownloadLink api res: ', getDownloadLinkRes);
        try {
          await AsyncStorage.setItem('splashURL', getDownloadLinkRes?.data?.companyData?.splash_screen);
        } catch (error) {
          logger('Async Storage setItem Division error: ', error);
        }
        let _vitalityMemberId = null;
        try {
          _vitalityMemberId = await AsyncStorage.getItem('vitalityMemberId');
        } catch (error) {
          logger(
            'error fetching vitalityMemberId from async storage',
            error,
          );
        }
        if (vitality_member_id) {
          if (!Number(getDownloadLinkRes?.data?.staffData?.reward_point)) {
            try {
              await AsyncStorage.removeItem('MoodInputTimeStamp');
              await AsyncStorage.removeItem('NotesInputTimeStamp');
            } catch (error) {
              console.log('error removing MoodInputTimeStamp NotesInputTImeStamp from AsyncStorage --- ', error);
            }
          }
          await AsyncStorage.setItem('vitalityMemberId', String(vitality_member_id)).then(e => { }).catch(e => { });
        } else if (_vitalityMemberId !== null) {
          await AsyncStorage.removeItem('vitalityMemberId').then(() => { }).catch((e) => { });
        }
        let userData = null;
        if (
          !getDownloadLinkRes?.data.staffData?.email &&
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
          userData?.email
        ) {
          RootNavigation?.getNavigationRef?.()?.current?.setParams?.({
            email: userData?.email,
          });
        }
        onDynamicLinkUpdate(userData, dispatch, async function (data) {
          if (data !== false) {
            if (data?.email) {
              if (!isEmpty(vitality_member_id)) {
                const params = {
                  device_id: deviceId,
                  user_id: getDownloadLinkRes.data.user_id,
                  email: data?.email ?? null,
                };
                dispatch(
                  Division(
                    getDownloadLinkRes?.data?.staffData?.division_id ?? '',
                  ),
                );
                getDivisionName("false 478, app",
                  params,
                  dispatch,
                  false,
                  async function (isFinish, userDetails) {
                    if (userData) {
                      dispatch(UserDetail(userDetails));
                    }
                    try {
                      await AsyncStorage.setItem(
                        'Division',
                        JSON.stringify(
                          getStore?.()?.getState?.()?.First?.UserDivision,
                        ),
                      );
                    } catch (error) {
                      console.log('Async Storage setItem Division error: ', error);
                    }
                  },
                );
                setDivisionSetFlag(true);
                dispatch(SetIsDivisionSelected(true));
                AsyncStorage.removeItem('LinkDisabled').catch(error => { });
                return;
              }
              if (RootNavigation?.navigationRef?.current?.navigate) {
                dispatch(SetIsDivisionSelected(false));
                RootNavigation?.navigationRef?.current?.navigate(
                  'HomeScreen',
                  {
                    screen: 'LinkCompanyStackNavigation',
                    params: {
                      screen: 'Linktocompany',
                      params: { email: data.email },
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
    setIsLinkLoader(false)
  }

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
      vitalityMemberId.current = null;
      return;
    }
    let unlinkReason = {
      id: 1,
      fileName: "app",
      email: userEmail,
      user_id: userId,
      link: JSON.stringify(link),
      linkModalText: linkModalText,
    }
    const params = {
      email: userEmail,
      user_id: userId,
      unlink_reason: JSON.stringify(unlinkReason)
    };
    PostRequestApi('unlinkToCompany', params)
      .then(async (resp) => {
        const isDone = await onUnlinkUpdate(dispatch);
        logger('unlinkToCompanyDone isDone =====', isDone);
        await AsyncStorage.removeItem('splashURL').then(() => {}).catch((e) => {});
        if (isDone) {
          linkCompany();
        } else {
          newOrg.current = null;
          vitalityMemberId.current = null;
        }
      })
      .catch((err) => {
        showFailedTouUnlinkToast();
        newOrg.current = null;
        vitalityMemberId.current = null;
        console.log('unlink api failed error: ', err);
      });
  }, [dispatch, linkCompany]);

  const onLinkCancel = useCallback(() => {
    setLinkModalText('');
    setIsLinkModalVisible(false);
    newOrg.current = null;
    vitalityMemberId.current = null;
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
    let memberId = url?.split?.('/?memberid=');
    console.log('memberId array after split --- ', memberId);
    if (Array.isArray(memberId) && memberId.length > 1) {
      memberId = memberId.pop();
    } else {
      memberId = null;
    }
    console.log('memberId --- ', memberId);
    let newOrgName = url?.split?.('/n/')?.pop?.();
    if (memberId) {
      newOrgName = url?.split?.('/?memberid=')?.[0]?.split?.('/n/')?.pop?.();
    }
    let org = url?.split?.('/org//')?.[1];
    if (!org) {
      org = url?.split?.('/org/')?.pop?.()?.split?.('/n')?.[0];
    }
    console.log('org user id====', org);
    console.log('existingOrgName name ====', existingOrgName);
    console.log('newOrgName name ====', newOrgName);
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
      !newOrgName.toLowerCase().includes(existingOrgName.toLowerCase())
    ) {
      const modalText = getLinkModalText(
        existingOrgName.toUpperCase(),
        newOrgName.toUpperCase(),
      );
      newOrg.current = org;
      vitalityMemberId.current = memberId;
      if (link) {
        setLink(link)
        isHandleDynamicLinkCalled.current = true;
      } else {
        setLink("");
      }
      setLinkModalText(modalText);
      setIsLinkModalVisible(true);
    } else if (!userEmail) {
      if (isHandleDynamicLinkCalled.current === true) {
        return;
      }
      if (link) {
        setLink(link)
        isHandleDynamicLinkCalled.current = true;
      }else{
        setLink("");
      }
      console.log('handleDynamicLink org: ', org);
      linkCompany(org, memberId);
    }
  };

  const goToSelectDivision = useCallback(() => {
    console.log('goToSelectDivision email: ', email);
    dispatch(SetIsDivisionSelected(false));
    RootNavigation?.navigationRef?.current?.navigate('HomeScreen', {
      screen: 'LinkCompanyStackNavigation',
      params: {
        screen: 'Linktocompany',
        params: { email: email },
      },
    });
  }, [email]);

  const CheckScreen = async (isCallFromDone = false) => {
    console.log('check screen called ...');
    let p = await AsyncStorage.getItem('ShowWelcomeScreen');
    let welcome = await JSON.parse(p);
    let aia = await AsyncStorage.getItem('IsRedirectToAIA');
    let isRedirectToAIA = await JSON.parse(aia);
    if ((isRedirectToAIA === null || isRedirectToAIA === true) && Platform.OS === 'ios' && isCallFromDone) {
      await AsyncStorage.setItem('IsRedirectToAIA', 'false');
      let url = '';
      url = 'https://v2020.page.link/mentalact';
      Linking.openURL(url).catch(error => {
        console.log('error redirecting to link url');
      });
    } else {
      await setShowWelcome((welcome === null || welcome === true));
      return Promise.resolve(welcome);
    }
    // console.log('welcome', welcome);
  };

  useEffect(() => {
    if (isHandleDynamicLinkCalled.current === true && UserData.UserDivision === null) {
      isHandleDynamicLinkCalled.current = false;
    }
  }, [UserData.UserDivision]);

  useEffect(() => {
    async function myFunc() {
      const getWelcomeScreen = async () => {
        try {
          let p = await AsyncStorage.getItem('ShowWelcomeScreen');
          let welcome = await JSON.parse(p);
          // console.log('Async storage welcome ===', welcome);
          if (getIsInitialVideoVisible() === false && welcome == null) {
            setIsInitialVideoVisible(true);
          }
        } catch (error) {
          console.log('Error in get AsyncStorage ShowWelcomeScreen');
        }
      };
      getWelcomeScreen();
      let isShowWelcome = false;
      try {
        isShowWelcome = await CheckScreen();
      } catch (e) {
        console.log('checkScreen error -->', e);
      }
      if (isShowWelcome === null || isShowWelcome === true) {
        try {
          await AsyncStorage.setItem('ShowWelcomeScreen', 'true');
        } catch (e) {
          console.log('ShowWelcomeScreen set ShowWelcomeScreen error -->', e);
        }
        try {
          await CheckScreen();
        } catch (e) {
          console.log('checkScreen error -->', e);
        }
        const timeoutId = setTimeout(() => {
          clearTimeout(timeoutId);
        }, 2500);
      } else {
        setShowWelcome(false);
        const timeoutId = setTimeout(() => {
          clearTimeout(timeoutId);
        }, 2500);
      }
      PushNotification.popInitialNotification((notification) => {
        // console.log('popInitialNotification Notification: ', notification);
        dispatch(SetNotification(notification));
      });
    }
    myFunc();
  }, []);

  useEffect(() => {
    if (
      UserData.UserEmail &&
      UserData.UserId &&
      UserData?.UserDetails?.division_id
    ) {
      const params = {
        division_id: UserData?.UserDetails?.division_id,
        email: UserData.UserEmail,
        user_id: UserData.UserId,
      };
      console.log('eapMessageData params ----->', params);
      PostRequestApi('eapMessageData', params)
        .then((resp) => {
          console.log('✅ ✅ ✅ ✅ Success eapMessageData ✅ ✅ ✅ ✅', resp?.data?.data);
          if (resp?.data?.data) {
            let data = {};
            if (resp?.data?.data?.eap_text) {
              data.eap_text = resp.data.data.eap_text;
            }
            if (resp?.data?.data?.eap_link) {
              data.eap_link = resp.data.data.eap_link;
            }
            if (!isEmpty(data)) {
              dispatch(SetNegativeMoodModalData(data));
            }
          }
        })
        .catch((err) => {
          console.log('❌ ❌ ❌ ❌ error eapMessageData❌ ❌ ❌ ❌ ', err);
        });
    } else if (!(UserData.UserEmail && UserData.UserId)) {
      dispatch(SetNegativeMoodModalData(defaultNegativeMoodModalData));
    }
  }, [
    UserData.UserEmail,
    UserData.UserId,
    UserData?.UserDetails?.division_id,
    dispatch,
  ]);

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
          RootNavigation.navigate('MoodEmotionDetector', {
            question: UserData?.notification?.data?.id,
            points: getUpdateAnswerRewardPoints(UserData?.notification?.data?.start_date),
          });
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
      logger("App has come to the foreground!");
      checkAppUpdate()
      NotifService.cancelMoodFloSheduledNotifications();
      dispatch(SetWeeklyInsightsTimeLeft(getWeeklyInsightsDaysLeft()));
      if (notifSchedulePreviousDay.current !== moment().day()) {
        fp();
      }
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", _handleAppStateChange);
    NotifService.cancelMoodFloSheduledNotifications();
    dispatch(SetWeeklyInsightsTimeLeft(getWeeklyInsightsDaysLeft()));
    return () => {
      subscription?.remove?.();
    };
  }, []);

  const getProfileUserData = async () => {
    logger("TESTING getProfileUserData CALLED",isHandleDynamicLinkCalled.current !== true)
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
    let negativeMoodPopupTimeStamp;
    try {
      let p = await AsyncStorage.getItem('NegativeMoodPopupTimeStamp');
      negativeMoodPopupTimeStamp = await JSON.parse(p);
    } catch (error) {
      console.log('Async Storage get NegativeMoodPopupTimeStamp error ', error);
    }
    if (negativeMoodPopupTimeStamp === null) {
      try {
        await AsyncStorage.setItem('NegativeMoodPopupTimeStamp', JSON.stringify(new Date().getTime()));
      } catch (error) {
        console.log('AsyncStorage set NegativeMoodPopupTimeStamp error ', error);
      }
    }

    // await AsyncStorage.setItem('DateCheck', JSON.stringify(aDay));
    // let DateCheck = await AsyncStorage.getItem('DateCheck');
    // let CheckForTodayDate = await JSON.parse(DateCheck);
    // if(CheckForTodayDate === )
    // let bDay = moment().format('DD MMM YYYY');

    // ---> checking all the data in local storage
    await AsyncStorage.setItem('Anonymous', 'true');
    let anonymous = await AsyncStorage.getItem('Anonymous');
    let UserId = await AsyncStorage.getItem('UserId');
    let Id = await JSON.parse(UserId);
    let p = await AsyncStorage.getItem('Email');
    let e = await JSON.parse(p);
    // let d = await AsyncStorage.getItem('Division');
    if ((e && Id) || isHandleDynamicLinkCalled.current === true) {
      console.log('App.js getProfileUserData email --->', e);
      console.log('App.js getProfileUserData userId --->', Id);
      dispatch(UserEmail(e));
      dispatch(GetUserId(Id));
    }
    let Wp = await AsyncStorage.getItem('GiveWeatherPerm');
    // let division = await JSON.parse(d);
    let WeatherP = await JSON.parse(Wp);
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
    //StandTime Permission
    let StandTimePer = await AsyncStorage.getItem('GiveStandTimePerm');
    let StandTimeP = await JSON.parse(StandTimePer);
    dispatch(StandTimePerm(StandTimeP));

    //ScreenTime Permission
    let ScreenTimePer = await AsyncStorage.getItem('GiveScreenTimePerm');
    let screenTimeP = await JSON.parse(ScreenTimePer);
    dispatch(ScreenTimePerm(screenTimeP));
    //Syncing Sleep Data
    if (Platform.OS === 'ios') {
      setSleepDataSync(dispatch, false);
    } else if (Platform.OS === 'android') {
      setSleepDataSync(dispatch);
    }
    // console.log(`Sleep Permission`, SleepP);
    // dispatch(UserDivision(division));
    dispatch(WeatherPerm(WeatherP));
    dispatch(IsAnonymous(a == null ? true : a));

    // ---> calling api for get user details
    const deviceId = getMyDeviceId();
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
    const message = "998 from app, inside getProfileUserData() method";
    GetStaffUserData(message,raw, dispatch)
      .then(async (result) => {
        // console.log(
        //   '✅ ✅ ✅ ✅ Success Get Staff User Data ✅ ✅ ✅ ✅',
        //   result?.userData
        // );
        if (result?.userData?.status !== 2) {
          await dispatch(UserDetail(result?.userData));
        }
        // if (
        //   result?.userData?.division_id &&
        //   typeof result.userData.division_id === 'string'
        // ) {
        //   setDivisionSetFlag(true);
        // }
      })
      .catch((error) => {
        console.log('❌ ❌ ❌ ❌ Error Get Staff User Data ❌ ❌ ❌ ❌', error);
      });
    const message2 =  "1018 from app, inside getProfileUserData() method ==>"+JSON.stringify(isHandleDynamicLinkCalled.current !== true);
    logger("TESTING CALLED",isHandleDynamicLinkCalled.current !== true)
    getDivisionName(message2,raw, dispatch, isHandleDynamicLinkCalled.current !== true);
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

  const checkApplicationPermission = async () => {
    try {
      const grant = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (grant) {
        fp();
      }
    } catch (error) {
      console.log("checkApplicationPermission Err", error);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      checkApplicationPermission()
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
    notifSchedulePreviousDay.current = moment().day();
  };

  useEffect(() => {
    UserData.AllMoods == null &&
      fetch(`${getApiBaseUrl()}getMood`)
        .then((data) => data.json())
        .then(async (res) => {
          // console.log('✅ ✅ ✅ ✅ getMood Api success ✅ ✅ ✅ ✅', res);
          // await setGetMoods(res.data);
          setMoodsArray(res?.data);
          await dispatch(Moods(res.data));
        })
        .catch((error) => {
          // const {code, message} = error;
          console.log('getMood Api error', error);
        });
    getProfileUserData();
  }, []);

  useEffect(() => {
    // console.log(`LightSensor`, LightSensor);
    if (
      UserData.WeatherPermission &&
      (UserData.lat == null || UserData.lon == null) &&
      getIsGetCurrentLocationCalled() === false
    ) {
      setIsGetCurrentLocationCalled(true);
      GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 15000,
      })
        .then((location) => {
          setIsGetCurrentLocationCalled(false);
          //   console.log('Success', location);
          // setlat(location.latitude);
          // const isIndia = isCountryIndia();
          // if (isIndia) {
          //   location = {
          //     latitude: defaultLocation.latitude,
          //     longitude: defaultLocation.longitude
          //   };
          // }
          console.log(
            '✅ ✅ ✅ ✅ Success GeoLocation Api ✅ ✅ ✅ ✅',
            JSON.stringify(location),
          );
          dispatch(
            SetLocation({
              lat: location.latitude,
              lon: location.longitude,
            }),
          );
        })
        .catch((error) => {
          const { code, message } = error;
          setIsGetCurrentLocationCalled(false);
          console.log('error getting lat lon from geolocation api', code, message);
        });
    }
  }, []);

  useEffect(() => {
    logger("TESTING 1134")
    
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    dynamicLinks().getInitialLink().then(handleDynamicLink);
    // handleDynamicLink();
    return () => unsubscribe?.();
    // return null;
  }, []);

  // useEffect(() => {
  //   const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
  //   // When the component is unmounted, remove the listener
  //   return () => unsubscribe();
  // }, []);


  useEffect(() => {
    if (
      (UserData.UserId && UserData.UserEmail) ||
      (!UserData.UserId && !UserData.UserEmail)
    ) {
      syncWeatherData();
      const userEmail = getStore?.()?.getState?.()?.First?.UserEmail ?? "";
      const userId = getStore?.()?.getState?.()?.First?.UserId ?? "";
      getUpdateRewardPoint({
        "device_id": getMyDeviceId?.() ?? "",
        "email": userEmail,
        "user_id": userId,
        "section_index": "",
        "reward_point": "",
        "description": ""
      }, dispatch);
    }
  }, [UserData.UserId, UserData.UserEmail]);

  useEffect(() => {
    if (!UserData.UserId && !UserData.UserEmail) {
      dispatch(SetAvailableRewards(null));
      dispatch(SetClaimedRewards(null));
    }
  }, [UserData.UserId, UserData.UserEmail]);

  const renderItems = ({ item, index }, parallaxProps) => {
    // console.log('item', item.img);
    // console.log('ShowWelcome--', ShowWelcome);
    return (
      <>
        <View activeOpacity={0.8} style={styles.item}>
          <Image
            source={item.img}
            height={'100%'}
            width={'100%'}
            style={{ height: '100%', width: '100%' }}
          />
        </View>
      </>
    );
  };

  const _onDone = async () => {
    await AsyncStorage.setItem('ShowWelcomeScreen', 'false');
    CheckScreen(true);
    try {
      await AsyncStorage.setItem('ShowWelcomeScreen', 'false');
    } catch (e) {
      console.warn(e);
    }
    checkAndSetPoints();
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

  const dismissMonthlyInsightsModal = () => {
    dispatch(SetShowMonthlyInsightsModal(false));
  };

  const closeLvlUpModal = useCallback(() => {
    setIsOpenLvlUpModal(false);
  }, []);

  const checkAndSetPoints = async () => {
    let p = await AsyncStorage.getItem('givePoints');
    let points = await JSON.parse(p);
    console.log(`points`, points);
    if (points === null) {
      await AsyncStorage.setItem('givePoints', '1');
      howMoodfloWorks();
    }
  };

  const howMoodfloWorks = () => {
    const userData = getStore?.()?.getState?.()?.First;
    const prevRewardPts = userData?.floCoins;
    const deviceId = getMyDeviceId();
    let params = {
      "device_id": deviceId,
      "email": userData?.UserEmail ?? null,
      "user_id": userData?.UserId ?? null,
      "section_index": 1,
      "reward_point": 50,
      "description": "How moodflo works"
    };
    console.log(`params of how mood flx works 50 coins`, params);
    setIsLoading(true);
    function onError() {
      setIsLoading(false);
    }
    getUpdateRewardPoint(params, dispatch, onError).then((res) => {
      console.log('getUpdateRewardPoint res.data----', res?.data);
      setIsLoading(false);
      if (
        res?.data?.reward_point &&
        getIsMoodLvlUp(prevRewardPts, res.data.reward_point)
      ) {
        const timeoutId = setTimeout(() => {
          setIsOpenLvlUpModal(true);
          clearTimeout(timeoutId);
        }, 400);
      }
    });
  };

  const checkAppUpdate = async () => {
    const isUpdate = await checkAppVersion()
    setUpdateModalAlert(isUpdate)
  }

  // useEffect(() => {
  //   if (Platform.OS === 'android' && !ShowWelcome) {
  //     // Make the bottom navigation bar transparent
  //     changeNavigationBarColor('transparent', true); // Second param is `true` to use light content.
  //   } else{
  //     changeNavigationBarColor('transparent', false); // Second param is `true` to use light content.

  //   }
  // }, [ShowWelcome]);

  return (
    <>
      {ShowWelcome === false ? (
        <NavigationContainer
          ref={RootNavigation.navigationRef}
          onReady={onNavigationReady}>
          <View style={styles.container}>
            <View style={styles.container}>
              <StackNavigation />
            </View>
          </View>
          <Toast config={toastConfig} />
        </NavigationContainer>
      ) : (
        <>
          <Screen1 onDone={_onDone} />
          <Toast config={toastConfig} />
        </>
      )}
      <Loader isLoading={isLinkLoader} />
      <LvlUpModal
        bigText="You've leveled up!"
        modalVisible={isOpenLvlUpModal && !isLoading}
        dismissModalHandler={closeLvlUpModal}
        buttonText="Let's Go!"
        verifyDone={closeLvlUpModal}
        smallText="Check out what rewards you've unlocked"
      />
      <CustomModal
        modalVisible={!!linkModalText && isLinkModalVisible}
        dismissModalHandler={onLinkCancel}
        modalText={linkModalText}
        onClickButtonOne={onLinkConfirm}
        buttonOneText="Unlink"
        onClickButtonTwo={onLinkCancel}
        buttonTwoText="Cancel"
      />
      <NoInternetModal
        modalVisible={!isConnected}
        onButtonOnePress={checkInternet}
      />
      <WeeklyInsightsProgress
        modalVisible={UserData.showWeeklyInsightsModal}
        verifyDone={dismissWeeklyInsightsModal}
        dismissModalHandler={dismissWeeklyInsightsModal}
      />
      <MonthlyInsightsProgress
        modalVisible={UserData.showMonthlyInsightsModal}
        verifyDone={dismissMonthlyInsightsModal}
        dismissModalHandler={dismissMonthlyInsightsModal}
      />
      <SetIsDevServerFlagModal
        isModalVisible={UserData.showIsDevServerModal}
        dispatch={dispatch}
      />
      <UpdateModal isVisible={updateModalAlert} />
    </>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  toastText: {
    fontSize: getFontSize(15),
    color: '#B56873',
    fontWeight: 'bold',
  },
  toastInfoText: {
    fontSize: getFontSize(13),
    color: 'rgb(66,66,66)',
  },
});

export default App;
