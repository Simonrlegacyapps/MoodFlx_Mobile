import React, {useEffect, useState, useRef, useReducer} from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  AppState,
} from 'react-native';
import Constants from '../../../Constants';
import {
  RubikExtraBold,
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../../Constants/fonts/Fonts';
// import ProgressBar from 'react-native-animated-progress';
import ProgressBar from '../../../Components/ProgressBar/ProgressBarCustom';
import HomeHeader from '../../../Components/HomeHeader/HomeHeader';
import BarGraph from '../../../Components/BarChart/BarGraph';
import BezierGraphAuto from '../../../Components/BezierGraphAuto/BezierGraphAuto';
import GraphicChart from '../../../Components/GraphicChart/GraphicChart';
import moment from 'moment';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Geocoder from 'react-native-geocoding';
import AsyncStorage from '@react-native-community/async-storage';
import GraphBezierCustom from '../../../Components/GraphBezierCustom/GraphBezierCustom';
import PopUp from '../../../Components/PopUp/PopUp';
import DeviceInfo from 'react-native-device-info';
import GetLocation from 'react-native-get-location';
import {
  dynamicSize,
  horizontalScale,
  isTablet,
} from '../../../Constants/sizeChoose';
import EditManualWeatherModal from '../../../Components/Modals/EditManualWeather/EditManualWeatherModal';
import {DayTemp, SetLocation} from '../../../redux/actions/actions';
import DateExpiredModal from '../../../Components/Modals/DateExpiredModal/DateExpiredModal';
import AnonymousPopUp from '../../../Components/Modals/AnonymousPopUp/AnonymousPopUp';
import WeatherGraphDurationModal from '../../../Components/Modals/WeatherGraphDurationModal/WeatherGraphDurationModal';
import {
  dataTypes,
  defaultLocation,
  getWeeklyInsightsAvailable,
  isCountryIndia,
  weatherActions,
  weatherTypes,
} from '../../../Constants/constants';
import {AppPermissions} from '../../../services/appPermissions';
import isFunction from 'lodash.isfunction';
import {findWeather, getDefaultTodaysHourlyData, getLocalTodaysHourlyData, getTodaysHourlyData} from './weatherService';
import PostRequestApi from '../../../apirequest/PostRequestApi';
import DataInsights from '../../../Components/DataInsights/DataInsights';
import CrownBox from '../../../Components/crownBox/crownBox'
import HomeSyncHeader from '../../../Components/HomeSyncHeader/HomeSyncHeader';

let weatherData = null;

const {width: SIZE} = Dimensions.get('window');

const weatherInsightsInitialState = {
  dailyInsights: '',
  weeklyInsights: '',
  dailySuggestion: '',
  dailySuggestionType: '',
  weeklySuggestion: '',
  weeklySuggestionType: '',
};

const weatherInsightsTypes = {
  SET_DALIY_INSIGHTS: 'SET_DALIY_INSIGHTS',
  SET_WEEKLY_INSIGHTS: 'SET_WEEKLY_INSIGHTS',
  SET_DAILY_SUGGESTION: 'SET_DAILY_SUGGESTION',
  SET__DAILY_SUGGESTION_TYPE: 'SET__DAILY_SUGGESTION_TYPE',
  SET_WEEKLY_SUGGESTION: 'SET_WEEKLY_SUGGESTION',
  SET__WEEKLY_SUGGESTION_TYPE: 'SET__WEEKLY_SUGGESTION_TYPE',
  SET_INSIGHTS: 'SET_INSIGHTS',
};

function weatherInsightsReducer(state, action) {
  switch (action.type) {
    case weatherInsightsTypes.SET_DALIY_INSIGHTS:
      return {...state, dailyInsights: action.payload};
    case weatherInsightsTypes.SET_WEEKLY_INSIGHTS:
      return {...state, weeklyInsights: action.payload};
    case weatherInsightsTypes.SET_DAILY_SUGGESTION:
      return {...state, dailySuggestion: action.payload};
    case weatherInsightsTypes.SET__DAILY_SUGGESTION_TYPE:
      return {...state, dailySuggestionType: action.payload};
    case weatherInsightsTypes.SET_WEEKLY_SUGGESTION:
      return {...state, weeklySuggestion: action.payload};
    case weatherInsightsTypes.SET__WEEKLY_SUGGESTION_TYPE:
      return {...state, weeklySuggestionType: action.payload};
    case weatherInsightsTypes.SET_INSIGHTS:
      return action?.payload && typeof action?.payload === 'object'
        ? {...state, ...action.payload}
        : state;
    default:
      return state;
  }
}

const IndicatorHelper = ({color, text}) => {
  return (
    <View style={styles.indicatorHelperView}>
      <View style={[styles.indicatorHelper, {backgroundColor: color}]} />
      <Text style={styles.indicatorText}>{text}</Text>
    </View>
  );
};

const WeatherData = ({
  // CheckForWeather,
  // PermWeather,
  // Weather,
  // data,
  // dataLow,
  // lat,
  // long,
  tryWeather,
  MoodCount,
  swiperIndex,
  index,
}) => {
  const [temp, settemp] = useState([]);
  const [One, setOne] = useState(null);
  const [Two, setTwo] = useState(null);
  const [Three, setThree] = useState(null);
  const [Four, setFour] = useState(null);
  const [Five, setFive] = useState(null);
  const [WeatherDay, setWeatherDay] = useState(null);
  const [hours, sethours] = useState(0);
  const [EditManualWeather, setEditManualWeather] = useState(false);
  const [ManualTemp, setManualTemp] = useState(null);
  const [ManulHours, setManulHours] = useState(null);
  const [ManulPollen, setManulPollen] = useState(null);
  const [ManualWeatherType, setManualWeatherType] = useState(null);
  const [AllDayWeather, setAllDayWeather] = useState(null);
  const [Graph, setGraph] = useState(null);
  const [WeatherPopUp, setWeatherPopUp] = useState(false);
  const [AnonymousClick, setAnonymousClick] = useState(false);
  const [WeatherDurationModal, setWeatherDurationModal] = useState(false);
  const [WeatherDuration, setWeatherDuration] = useState('Week');
  const [minMaxGraphHeight, setMinMaxGraphHeight] = useState(horizontalScale(200));
  const [insights, setInsights] = useReducer(
    weatherInsightsReducer,
    weatherInsightsInitialState,
  );
  const appState = useRef(AppState.currentState);
  const isMinMaxHeightSet = useRef(false);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const allDayWeatherData = useRef(null);

  const a = moment().utc().subtract(1, 'day').startOf('day').toString();
  const b = moment().subtract(1, 'days').startOf('day').toString();
  const c = moment().subtract(2, 'days').startOf('day').toString();
  const d = moment().subtract(3, 'days').startOf('day').toString();
  const e = moment().subtract(4, 'days').startOf('day').toString();

  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();
  const [openActionSheet, setOpenActionSheet] = useState(false);

  let Weather = UserData.DayTemperature;

  // console.log(`Weather`, UserData.DayTemperature);
  const getUserLocation = async () => {
    new Promise((resolve, reject) => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 15000,
      })
        .then((location) => {
          const isIndia = isCountryIndia();
          if (isIndia) {
            location = {
              latitude: defaultLocation.latitude,
              longitude: defaultLocation.longitude
            };
          }
          console.log('Success', location);
          // setlat(location.latitude);
          dispatch(SetLocation({
            lat: location.latitude,
            lon: location.longitude,
          }));
          location?.latitude && location?.longitude && CheckForWeather(location?.latitude, location?.longitude, function (flag) {
            console.log('WeatherDayData called from getUserLocation');
            location?.latitude && location?.longitude && WeatherDayData(location?.latitude, location?.longitude, function (isSuccess) {
              resolve(isSuccess);
            });
              },
            );
          // if (UserData.lat == null || UserData.lon == null) {
          // }
        })
        .catch(async (error) => {
          const {code, message} = error;
          let flag;
          try {
            flag = await AppPermissions.requestLocationPermission(dispatch);
          } catch (e) {
            console.log('Request Location Permission error: ', e);
            flag = false
          }
          resolve(flag);
          console.log('error', code, message);
        });
    });
  };

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      AppPermissions.checkAppPermissions(dispatch);
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    if (UserData.WeatherPermission) {
      getUserLocation();
    }
    return () => {
      weatherData = null;
    }
  }, []);

  let valueHours = 0;
  const WeatherDayData = (loc_lat, loc_long, onFinish) => {
    let startTime;
    const isIndia = isCountryIndia();
    if (isIndia) {
      startTime = moment
        .utc()
        // .utcOffset(defaultLocation.timeZoneOffset)
        .subtract(1, 'day')
        .startOf('day')
        .toString();
    } else {
      startTime = a;
    }
    console.log('WeatherDayData function loc_lat: ', loc_lat);
    console.log('WeatherDayData function loc_long: ', loc_long);
    console.log('WeatherDayData function args: ', startTime);
    let value = 0;
    allDayWeatherData.current = null;
    let previousDayData;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${loc_lat}&lon=${loc_long}&dt=${Date.parse(startTime) / 1000
        }&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
      )
      .then(async (response) => {
        // console.log(`weather day data api success response`, response);
        console.log(
          'weather day data api success response',
          JSON.stringify(response?.data?.hourly),
        );
        console.log(
          'weather day data lenght',
          JSON.stringify(response?.data?.hourly?.length),
        );
        previousDayData = response?.data;
        // let todaysHourlyData;
        // if (response?.data?.hourly) {
        //   if (isIndia) {
        //     todaysHourlyData = getDefaultTodaysHourlyData(
        //       [],
        //       response.data.hourly,
        //     );
        //   } else {
        //     todaysHourlyData = getLocalTodaysHourlyData(
        //       [],
        //       response.data.hourly,
        //     );
        //   }
        // }
        // // console.log(`TODAYS_HOURLY_DATA: `, JSON.stringify(todaysHourlyData));
        // if (response?.data && Array.isArray(todaysHourlyData)) {
        //   allDayWeatherData.current = Object.assign({}, response.data, { hourly: [...todaysHourlyData] });
        // }
        startTime = null;
        startTime = moment.utc().startOf('day').toString();
        return axios.get(
          `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${loc_lat}&lon=${loc_long}&dt=${
            Date.parse(startTime) / 1000
          }&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
        );
      })
      .then(async (response) => {
        let todaysHourlyData;
        console.log(
          'weather day data api success response',
          JSON.stringify(response?.data?.hourly),
        );
        console.log(
          'weather day data lenght',
          JSON.stringify(response?.data?.hourly?.length),
        );
        console.log(
          'allDayWeatherData.current?.hourly',
          !!allDayWeatherData.current?.hourly,
        );
        if (
          Array.isArray(previousDayData?.hourly) &&
          Array.isArray(response?.data?.hourly)
        ) {
          if (isIndia) {
            todaysHourlyData = getDefaultTodaysHourlyData(
              previousDayData.hourly,
              response.data.hourly,
            );
          } else {
            todaysHourlyData = getLocalTodaysHourlyData(
              previousDayData.hourly,
              response.data.hourly,
            );
          }
        }
        // console.log(`weather day data api success response`, response);
        // console.log(`weather day data api success response`, JSON.stringify(response?.data?.hourly));
        console.log(`TODAYS_HOURLY_DATA: `, JSON.stringify(todaysHourlyData));
        if (response?.data) {
          if (Array.isArray(todaysHourlyData)) {
            setAllDayWeather(todaysHourlyData)
            allDayWeatherData.current = Object.assign({}, response.data, {
              hourly: [...todaysHourlyData],
            });
          }
          // console.log('allDayWeatherData: ', allDayWeatherData.current);
          syncWeatherData(loc_lat, loc_long);
          if (isFunction(onFinish)) {
            onFinish(true);
          }
        }
        // console.log(`weather day data api success response`, response);
        if (weatherData) {
          if (allDayWeatherData.current?.hourly) {
            for (let i in allDayWeatherData.current.hourly) {
              if (
                (weatherData?.weather?.[0]?.description ?? -1) ===
                allDayWeatherData.current?.hourly?.[i]?.weather?.[0]
                  ?.description
              ) {
                value = value + 1;
                sethours(value);
                valueHours = value;
              }
            }
          }
        } else {
          CheckForWeather(loc_lat, loc_long);
        }
      })
      .catch(function (error) {
        if (isFunction(onFinish)) {
          onFinish(false);
        }
        console.log(`error for weather here`, error);
      });
  };

  // const findWeather = (value) => {
  //   const v = value?.toLowerCase?.() ?? value;
  //   return weatherApiDataTypes?.[v] ?? weatherTypes.Cloudy;
  // };
  // console.log('UserData?.DayTemperature?.weather', UserData?.DayTemperature)

  const callInsightsApi = () => {
    const deviceId = DeviceInfo.getUniqueId();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var params = {
      device_id: deviceId,
      email: UserData?.UserEmail ?? '',
      user_id: UserData?.UserId ?? '',
    };

    console.log(`Weather Insights Api Params`, params);
    PostRequestApi('getWeatherInsights', {...params, status: 'daily'})
      .then((res) => {
        console.log('getWeatherInsights daily: ', res?.data?.insights);
        // console.log('getSleepInsights daily res: ', res);
        let dailyInsightsPayload = {};
        dailyInsightsPayload.dailyInsights =
          !!res?.data?.insights?.message1 &&
          typeof res.data.insights.message1 === 'string'
            ? res.data.insights.message1
            : '';
        dailyInsightsPayload.dailySuggestion =
          !!res?.data?.insights?.message2 &&
          typeof res.data.insights.message2 === 'string'
            ? res.data.insights.message2
            : '';
        dailyInsightsPayload.dailySuggestionType =
          !!res?.data?.insights?.message2Type &&
          res?.data?.insights?.message2Type?.toLowerCase?.() === 'warning'
            ? res.data.insights.message2Type
            : '';
        setInsights({
          type: weatherInsightsTypes.SET_INSIGHTS,
          payload: dailyInsightsPayload,
        });
        /*
        Weekly api should be called between
        Friday @ 12pm until Saturday 6pm
        */
        if (getWeeklyInsightsAvailable() === true) {
          return PostRequestApi('getWeatherInsights', {
            ...params,
            status: 'weekly',
          });
        } else {
          return new Promise((resolve, reject) => resolve(null));
        }
      })
      .then((res) => {
        // console.log('getSleepInsights weekly res: ', res);
        let weeklyInsightsPayload = {};
        console.log('getWeatherInsights weekly: ', res?.data?.insights);
        weeklyInsightsPayload.weeklyInsights =
          !!res?.data?.insights?.message1 &&
          typeof res.data.insights.message1 === 'string'
            ? res.data.insights.message1
            : '';
        weeklyInsightsPayload.weeklySuggestion =
          !!res?.data?.insights?.message2 &&
          typeof res.data.insights.message2 === 'string'
            ? res.data.insights.message2
            : '';
        weeklyInsightsPayload.weeklySuggestionType =
          !!res?.data?.insights?.message2Type &&
          res?.data?.insights?.message2Type?.toLowerCase?.() === 'warning'
            ? res.data.insights.message2Type
            : '';
        setInsights({
          type: weatherInsightsTypes.SET_INSIGHTS,
          payload: weeklyInsightsPayload,
        });
      })
      .catch(function (error) {
        console.log(
          '❌❌❌❌Fail Get Weather Insights ❌❌❌❌',
          error,
          params,
        );
      });
  };


  const syncWeatherData = async (lat = UserData.lat, lng = UserData.lon) => {
    let Wp = await AsyncStorage.getItem('GiveWeatherPerm');
    let WeatherP = await JSON.parse(Wp);
    if (!WeatherP && !UserData.WeatherPermission) {
      console.log('Cannot sync weather data without permisison.');
      return;
    }
    if (!allDayWeatherData.current) {
      console.log('Cannot call update weather api without weather data');
      return;
    }
    let geocode = null;
    Geocoder.init('AIzaSyD8BafHP8VtNFGyMg4uozFJcgsBaKDxS9s');
    var state_info = '';
    var city_info = '';
    var country_info = '';
    await Geocoder.from({
      lat: lat,
      lng: lng,
    })
      .then((data) => {
        geocode = data.plus_code.compound_code;
        const address_list = data.results[0].address_components;
        for (i = 0; i < address_list.length; i++) {
          if (address_list[i].types.includes('country')) {
            country_info = address_list[i].long_name;
          }
          if (address_list[i].types.includes('administrative_area_level_1')) {
            state_info = address_list[i].long_name;
          }
          if (address_list[i].types.includes('administrative_area_level_2')) {
            city_info = address_list[i].long_name;
          }
        }
      })
      .catch((err) => console.log(`weather api location err`, err));
    const isIndia = isCountryIndia();
    const deviceId = DeviceInfo.getUniqueId();
    const data = JSON.stringify({
      user_id: UserData.UserId,
      email: UserData.UserEmail,
      device_id: deviceId,
      hours: ManulHours ? ManulHours : hours,
      weather_type: ManualWeatherType
        ? ManualWeatherType
        : findWeather(weatherData?.weather?.[0]?.main),
      pollen: null,
      pollen_type: ManulPollen ? ManulPollen : 'Low',
      weather_data: allDayWeatherData.current,
      temp_min: weatherData?.main?.temp_min,
      temp_max: weatherData?.main?.temp_max,
      temp: ManualTemp
        ? ManualTemp
        : Math.round(Weather?.main?.temp ? Weather.main.temp : '0'),
      city: isIndia && city_info ? defaultLocation.city : city_info,
      state: isIndia && state_info ? defaultLocation.state : state_info,
      country: isIndia && country_info ? defaultLocation.country : country_info,
      lat: isIndia && UserData.lat ? defaultLocation.latitude : UserData.lat,
      lon: isIndia && UserData.lon ? defaultLocation.longitude : UserData.lon,
    });

    // console.log('weather', data);
    var config = {
      method: 'post',
      url: 'https://admin.moodflo.com/api/updateWeather',
      headers: {
        'Content-Type': 'application/json',
        Cookie: '__cfduid=de42be196e76a7e54fe0b710d009e4dd11615455418',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(' ✅ ✅ ✅ ✅ Update Weather Success ✅ ✅ ✅ ✅ ', data);
        console.log(' ✅ ✅ ✅ ✅ Update Weather Success ✅ ✅ ✅ ✅ ');
        callInsightsApi();
        getWeather();
      })
      .catch(function (error) {
        // console.log('❌❌❌❌ Update Weather Fail ❌❌❌❌', error, data);
        console.log('❌❌❌❌ Update Weather Fail ❌❌❌❌', error);
      });
  };

  const th = async (lat, lng) => {
    console.log('called from th');
    WeatherDayData(lat, lng);
  };

  const VerifyDone = async () => {
    const v = await getUserLocation();
    const timeoutIdOut = setTimeout(() => {
      AppPermissions.checkAppPermissions(dispatch);
      const timeoutIdIn = setTimeout(() => {
        AppPermissions.checkAppPermissions(dispatch);
        syncWeatherData();
        clearTimeout(timeoutIdIn);
      }, 1000);
      clearTimeout(timeoutIdOut);
    }, 1000);
    // await AsyncStorage.setItem('GiveWeatherPerm', 'true');
    setOpenActionSheet(false);
    // let Wp = await AsyncStorage.getItem('GiveWeatherPerm');
    // let WeatherP = await JSON.parse(Wp);
    // console.log(`WeatherPerm`, WeatherP);
    // dispatch(WeatherPerm(WeatherP));
  };

  // useEffect(() => {
  //   let lat = UserData.lat;
  //   let lng = UserData.lon;
  //   if (!UserData.WeatherPermission){
  //     lat = defaultLocation.latitude;
  //     lng = defaultLocation.longitude;
  //   }
  //   th(lat, lng);
  // }, []);

  useEffect(() => {
    let lat = UserData.lat;
    let lng = UserData.lon;
    if (!UserData.WeatherPermission) {
      lat = defaultLocation.latitude;
      lng = defaultLocation.longitude;
    }
    if (
      ((UserData.UserId && UserData.UserEmail) ||
        (!UserData.UserId && !UserData.UserEmail)) &&
      ((UserData.lat && UserData.lon) || (!UserData.lat && !UserData.lon))
    ) {
      CheckForWeather(lat, lng, function (flag) {
        if (flag === true) {
          if (UserData.lat && UserData.lon && UserData.WeatherPermission) {
            console.log('called from userEffect checkForWeather');
            console.log('called from userEffect checkForWeather UserData.lat: ', UserData.lat);
            console.log('called from userEffect checkForWeather UserData.lon: ', UserData.lon);
            console.log('called from userEffect checkForWeather');
            th(UserData.lat, UserData.lon);
          }
        }
      });
    }
  }, [
    UserData.lat,
    UserData.lon,
    UserData.WeatherPermission,
    UserData.UserId,
    UserData.UserEmail,
  ]);

  const CheckForWeather = async (
    loc_lat = UserData.lat,
    loc_long = UserData.lon,
    onFinish,
  ) => {
    // let Wp = await AsyncStorage.getItem('GiveWeatherPerm');
    // let WeatherP = await JSON.parse(Wp);
    // dispatch(WeatherPerm(WeatherP));
    if (!(loc_lat && loc_long)) {
      onFinish?.(false);
      return;
    }
    // if (UserData.WeatherPermission) {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${loc_lat}&lon=${loc_long}&exclude=hourly,minutely&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
      )
      .then(async (response) => {
        console.log(
          ' ✅ ✅ ✅ ✅ Success CheckForWeather✅ ✅ ✅ ✅ ',
          response?.data,
        );
        dispatch(DayTemp(response?.data));
        weatherData = response?.data ? response?.data : weatherData;
        onFinish?.(true);
        // await setTryWeather(response?.data);
        // await console.log(`response.data for weather`, response.data);
      })
      .catch(function (error) {
        onFinish?.(false);
        console.log('Error CheckForWeather❌❌❌❌', error);
      });
    // }
  };

  const getWeather = () => {
    const deviceId = DeviceInfo.getUniqueId();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      device_id: deviceId,
      email: UserData.UserEmail,
      user_id: UserData.UserId,
    });

    // console.log(`raw of weather graph data`, raw);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    let timeOutId = setTimeout(() => {
      console.log(`Weather Graph Data Params`, raw);
      fetch('https://admin.moodflo.com/api/getWeatherReport', requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          console.log('Get weather Graph data', result),
            console.log(' ✅ ✅ ✅ ✅ Get Weather Success ✅ ✅ ✅ ✅ ');
          setGraph(result.weatherData);
          data.push({});
          // await syncWeatherData();
        })
        .catch((error) => console.log('error', error));
      clearTimeout(timeOutId);
      timeOutId = null;
    }, 1000);
    return () => {
      if (timeOutId !== null) {
        clearTimeout(timeOutId);
        timeOutId = null;
      }
    };
  };

  useEffect(() => {
    getWeather();
  }, []);

  const data = [
    {
      x: 1,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[6]?.temp_max
            ? 0
            : Graph[6] && Graph[6].temp_max
          : 0,
    },
    {
      x: 2,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[5]?.temp_max
            ? 0
            : Graph[5].temp_max
          : 0,
    },
    {
      x: 3,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[4]?.temp_max
            ? 0
            : Graph[4].temp_max
          : 0,
    },
    {
      x: 4,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[3]?.temp_max
            ? 0
            : Graph[3].temp_max
          : 0,
    },
    {
      x: 5,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[2]?.temp_max
            ? 0
            : Graph[2].temp_max
          : 0,
    },
    {
      x: 6,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[1]?.temp_max
            ? 0
            : Graph[1].temp_max
          : 0,
    },
    {
      x: 7,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[0]?.temp_max
            ? 0
            : Graph[0].temp_max
          : 0,
    },
  ];

  const dataLow = [
    {
      x: 1,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[6]?.temp_min
            ? 0
            : Graph[6] && Graph[6].temp_min
          : 0,
    },
    {
      x: 2,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[5]?.temp_min
            ? 0
            : Graph[5].temp_min
          : 0,
    },
    {
      x: 3,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[4]?.temp_min
            ? 0
            : Graph[4].temp_min
          : 0,
    },
    {
      x: 4,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[3]?.temp_min
            ? 0
            : Graph[3].temp_min
          : 0,
    },
    {
      x: 5,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[2]?.temp_min
            ? 0
            : Graph[2].temp_min
          : 0,
    },
    {
      x: 6,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[1]?.temp_min
            ? 0
            : Graph[1].temp_min
          : 0,
    },
    {
      x: 7,
      y:
        Graph && WeatherDuration === 'Week'
          ? !Graph[0]?.temp_min
            ? 0
            : Graph[0].temp_min
          : 0,
    },
  ];

  // console.log(`data`, data);

  let heightProp = isTablet ? horizontalScale(30) : SIZE / 4.3;
  let widthProp = isTablet
    ? Math.round(SIZE - SIZE * 0.48)
    : Math.round(SIZE - 138);

  const max =
    data &&
    Math.max.apply(
      Math,
      data.map(function (o) {
        return o.y;
      }),
    );

  const Lowmax =
    dataLow &&
    Math.max.apply(
      Math,
      dataLow.map(function (o) {
        return o.y;
      }),
    );

  const Lowmin =
    dataLow &&
    Math.min.apply(
      Math,
      dataLow.map(function (o) {
        return o.y;
      }),
    );

  const WeatherDurations = [{ label: 'Day' }, { label: 'Week' }, { label: 'Month' }];

  // console.log(`Lowmax`, data, dataLow);

  const editTemp = () => {
    setEditManualWeather(true);
  };
  const cancelled = () => {
    setEditManualWeather(false);
  };

  const EditDone = () => {
    cancelled();
    syncWeatherData();
  };

  const WeatherPopUpcancelled = () => {
    setWeatherPopUp(false);
  };

  const AnonymousPopUpcancelled = () => {
    setAnonymousClick(false);
  };

  const WeatherDurationModalCancelled = () => {
    setWeatherDurationModal(false);
  };

  const dataOfWeatherGraph = [
    {
      x: '12am',
      y: AllDayWeather?.[0]?.temp ?? 0,
    },
    // {
    //   x: '1',
    //   y: AllDayWeather?.[1]?.temp ?? 0,
    // },
    // {
    //   x: '2',
    //   y: AllDayWeather?.[2]?.temp ?? 0,
    // },
    // {
    //   x: '3',
    //   y: AllDayWeather?.[3]?.temp ?? 0,
    // },
    {
      x: '4',
      y: AllDayWeather?.[4]?.temp ?? 0,
    },
    // {
    //   x: '5',
    //   y: AllDayWeather?.[5]?.temp ?? 0,
    // },
    // {
    //   x: '6',
    //   y: AllDayWeather?.[6]?.temp ?? 0,
    // },
    // {
    //   x: '7',
    //   y: AllDayWeather?.[7]?.temp ?? 0,
    // },
    {
      x: '8',
      y: AllDayWeather?.[8]?.temp ?? 0,
    },
    // {
    //   x: '9',
    //   y: AllDayWeather?.[9]?.temp ?? 0,
    // },
    // {
    //   x: '10',
    //   y: AllDayWeather?.[10]?.temp ?? 0,
    // },
    // {
    //   x: '11',
    //   y: AllDayWeather?.[11]?.temp ?? 0,
    // },
    {
      x: '12pm',
      y: AllDayWeather?.[12]?.temp ?? 0,
    },
    // {
    //   x: '1',
    //   y: AllDayWeather?.[13]?.temp ?? 0,
    // },
    // {
    //   x: '2',
    //   y: AllDayWeather?.[14]?.temp ?? 0,
    // },
    // {
    //   x: '3',
    //   y: AllDayWeather?.[15]?.temp ?? 0,
    // },
    {
      x: '4',
      y: AllDayWeather?.[16]?.temp ?? 0,
    },
    // {
    //   x: '5',
    //   y: AllDayWeather?.[17]?.temp ?? 0,
    // },
    // {
    //   x: '6',
    //   y: AllDayWeather?.[18]?.temp ?? 0,
    // },
    // {
    //   x: '7',
    //   y: AllDayWeather?.[19]?.temp ?? 0,
    // },
    {
      x: '8',
      y: AllDayWeather?.[20]?.temp ?? 0,
    },
    // {
    //   x: '9',
    //   y: AllDayWeather?.[21]?.temp ?? 0,
    // },
    // {
    //   x: '10',
    //   y: AllDayWeather?.[22]?.temp ?? 0,
    // },
    {
      x: '11',
      y: AllDayWeather?.[23]?.temp ?? 0,
    },
  ];
  // console.log(`AllDayWeather`, AllDayWeather);
  const onLayoutMinMaxGraphView = (e) => {
    !isMinMaxHeightSet.current && setMinMaxGraphHeight((h) => !isNaN(e?.nativeEvent?.layout?.height) ? Math.floor(e.nativeEvent.layout.height) : h);
    isMinMaxHeightSet.current = true;
  };
  const _weatherType = ManualWeatherType
    ? ManualWeatherType
    : weatherData
      ? findWeather(Weather?.weather?.[0]?.main)
      : weatherTypes.Cloudy;

  const _weatherAction =
    weatherActions?.[_weatherType] ?? weatherActions.Cloudy;

  const _largeWeatherImg =
    Constants.Images?.[_weatherType] ?? Constants.Images.Cloudy;
  const _smallWeatherIcon =
    _weatherType === weatherTypes.Rainy
      ? Constants.Images.RainyHour
      : _largeWeatherImg;
  const currentTemp = ManualTemp
    ? ManualTemp
    : Math.round(Weather?.main?.temp ? Weather.main.temp : '0');

  return (
    <View style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        {/* <View style={styles.HeaderView}>
          <TouchableOpacity
            onPress={async () => {
              setOpenActionSheet(true);
            }}
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.syncButtonView}>
              <Image
                style={{ height: 20, width: 20 }}
                source={Constants.Images.Sync}
              />
            </View>
            <View style={{ alignContent: 'center', paddingHorizontal: 15 }}>
              <Text style={styles.lightText}>
                {UserData.WeatherPermission ? 'Syncing your' : 'Sync your'}
              </Text>
              <Text style={styles.normalText}>Weather data</Text>
            </View>
          </TouchableOpacity>
          <CrownBox floCoins={UserData.floCoins}/>
          <TouchableOpacity
            onPress={() => setAnonymousClick(true)}
            style={styles.ColoredView}>
            <Text style={styles.ColoredText}>Anon</Text>
          </TouchableOpacity>
        </View> */}
        <HomeSyncHeader label ={"Weather"} setOpenActionSheet={setOpenActionSheet} setAnonymousClick={setAnonymousClick}/>
        <View style={styles.ProgressBarView}>
          <ProgressBar
            progress={
              // swiperIndex == 1
              ((JSON.parse(MoodCount) < 3 ? JSON.parse(MoodCount) : 3) / 3) *
              100
              // : 0
            }
            MoodCount={JSON.parse(MoodCount)}
            height={10}
            backgroundColor="#CB9866"
          />
          <View style={{ flexDirection: 'row' }}>
            <Text numberOfLines={1} style={[styles.SmallThinText, { flex: 1 }]}>
              {JSON.parse(MoodCount) < 3
                ? 'Try add 3 moods per day'
                : `Boom! You've added ${JSON.parse(MoodCount)} moods today`}
            </Text>
            <Text
              style={
                (styles.SmallThinText, { paddingTop: 10, paddingVertical: 0 })
              }>
              {JSON.parse(MoodCount) === null ? 0 : JSON.parse(MoodCount)}
              /3
            </Text>
          </View>
        </View>
        <View>
          {!UserData.WeatherPermission ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={[styles.SmallThinText, { paddingVertical: 9 }]}>
                WEATHER
              </Text>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  // fontSize: SIZE / 14,
                  // fontWeight: '500',
                  alignItems: 'center',
                  width: '100%',
                }}
                onPress={() => setWeatherPopUp(true)}>
                <Text style={styles.swiperText}>
                  You are more <Text style={{ color: '#5947D0' }}>energetic</Text>{' '}
                  when the temperature is below{' '}
                  <Text style={{ color: '#5947D0' }}>20°</Text> and it{' '}
                  <Text style={{ color: '#5947D0' }}>rains</Text> around{' '}
                  <Text style={{ color: '#5947D0' }}>2hrs</Text>
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <DataInsights
              dailyInsights={insights?.dailyInsights}
              weeklyInsights={insights?.weeklyInsights}
              dailySuggestion={insights?.dailySuggestion}
              dailySuggestionType={insights?.dailySuggestionType}
              weeklySuggestion={insights?.weeklySuggestion}
              weeklySuggestionType={insights?.weeklySuggestionType}
              timeLeft={UserData?.weeklyInsightsTimeLeft}
              dispatch={dispatch}
            />
          )}

          <View style={styles.WeatherCardMain}>
            {swiperIndex == index && (
              <View style={styles.WeatherCard}>
                <Text
                  style={[
                    styles.SmallThinText,
                    { paddingVertical: 0, paddingBottom: 4 },
                  ]}>
                  Today's Weather
                </Text>
                <Text style={[styles.SmallThinText, styles.city]}>
                  {UserData.WeatherPermission
                    ? Weather?.name
                    : 'Sync your weather'}
                </Text>
                <View>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={editTemp}
                    style={{
                      width: 260,
                      backgroundColor: 'white',
                      margin: 10,
                      borderRadius: 15,
                      marginHorizontal: 20,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        padding: 15,
                        overflow: 'hidden',
                      }}>
                      <Image
                        resizeMode={'contain'}
                        source={_largeWeatherImg}
                        style={{ margin: 10, marginHorizontal: 20 }}
                      />
                      <View>
                        <Text style={[styles.Card1Text]}>{_weatherType}</Text>
                        <Text
                          style={[
                            ,
                            {
                              fontFamily: RubikMedium,
                              fontSize: dynamicSize(32),
                            },
                          ]}>
                          {currentTemp}
                          ºC
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={editTemp}>
                      <Image
                        style={{
                          resizeMode: 'contain',
                          height: dynamicSize(21),
                          width: dynamicSize(21),
                          marginTop: -25,
                          right: 5,
                          bottom: 7,
                          alignSelf: 'flex-end',
                        }}
                        source={Constants.Images.Edit}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                  <View style={styles.CardsView}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={editTemp}
                      style={styles.card2View}>
                      <View style={{ flexDirection: 'row', padding: 15 }}>
                        <Image
                          resizeMode={'contain'}
                          source={_smallWeatherIcon}
                          style={styles.SmallCardImage}
                        />
                        <View>
                          <Text style={[styles.smallCardText]}>
                            {_weatherAction}
                          </Text>
                          <Text
                            style={[
                              ,
                              {
                                fontFamily: RubikMedium,
                                fontSize: dynamicSize(15),
                              },
                            ]}>
                            {ManulHours ? ManulHours : hours ? hours : 1}hr
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity onPress={editTemp}>
                        <Image
                          style={{
                            resizeMode: 'contain',
                            height: dynamicSize(19),
                            width: dynamicSize(19),
                            marginTop: -18,
                            right: 5,
                            bottom: 7,
                            alignSelf: 'flex-end',
                          }}
                          source={Constants.Images.Edit}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={editTemp}
                      style={{
                        width: 120,
                        backgroundColor: 'white',
                        borderRadius: 15,
                      }}>
                      <View style={{ flexDirection: 'row', padding: 15 }}>
                        <Image
                          resizeMode={'contain'}
                          source={Constants.Images.Pollen}
                          style={{
                            margin: 5,
                            height: 15,
                            width: 15,
                            justifyContent: 'center',
                            marginTop: 10,
                            marginLeft: -5,
                            marginRight: 10,
                          }}
                        />
                        <View>
                          <Text style={[, styles.smallCardText]}>Pollen</Text>
                          <Text
                            style={[
                              {
                                fontFamily: RubikMedium,
                                fontSize: dynamicSize(14.5),
                              },
                            ]}>
                            {ManulPollen ? ManulPollen : 'Low'}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity onPress={editTemp}>
                        <Image
                          style={{
                            resizeMode: 'contain',
                            height: dynamicSize(19),
                            width: dynamicSize(19),
                            marginTop: -18,
                            right: 5,
                            bottom: 8,
                            alignSelf: 'flex-end',
                          }}
                          source={Constants.Images.Edit}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* <ProgressBarCustom /> */}
          <HomeHeader
            // click={() => setWeatherDurationModal(true)}
            // value={WeatherDuration}
          />
          <View style={{ marginBottom: 50, alignItems: 'center' }}>
            {swiperIndex == index && (
              <BarGraph
                max={max}
                min={Lowmin}
                color={'#7265E3'}
                TopLabels
                ShowPollen={true}
                RightBar={true}
              />
            )}
            <View
              style={{
                // flex: 1,
                position: 'absolute',
                left: SIZE / 6,
                // alignSelf: 'center',
                // alignItems: 'center',
                // justifyContent: 'center',
                marginTop: 30,
              }}>
              {swiperIndex == index && (
                <View onLayout={onLayoutMinMaxGraphView}>
                  <View style={{position: 'absolute'}}>
                    <GraphBezierCustom
                      // abs
                      heightProp={minMaxGraphHeight}
                      stroke="#F4227E"
                      widthProp={widthProp}
                      data={data}
                      max={max}
                      H={9}
                    />
                  </View>
                  <View style={{ marginTop: 0 }}>
                    <GraphBezierCustom
                      heightProp={minMaxGraphHeight}
                      stroke="#70DEEC"
                      widthProp={widthProp}
                      data={dataLow}
                      max={Lowmax}
                      H={9}
                    />
                  </View>
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: 15,
              }}>
              <IndicatorHelper color={'#7FE3F0'} text={'Min ºC'} />
              <IndicatorHelper color={'#FC4190'} text={'Max ºC'} />
              <IndicatorHelper color={'#7265E3'} text={'Rainfall'} />
              <IndicatorHelper color={'#0DDE7A'} text={'Pollen'} />
            </View>
          </View>
          {swiperIndex == index && (
            <GraphicChart
              isDailyDisabled={false}
              dataOfWeatherGraph={dataOfWeatherGraph}
              graphType={dataTypes.weather}
              // fitness={false}
            />
          )}
          {!UserData.WeatherPermission && (
            <View
              style={{
                position: 'absolute',
                top: 420,
                alignItems: 'center',
                height: '100%',
                width: '100%',
                zIndex: -234234,
              }}>
              <Text
                style={{
                  marginTop: dynamicSize(-300),
                  fontWeight: '700',
                  fontFamily: RubikExtraBold,
                  fontSize: SIZE / 3.5,
                  color: '#E0DDED',
                  transform: [{ rotate: '-15deg' }],
                }}>
                Demo
              </Text>
            </View>
          )}
          {!UserData.WeatherPermission && (
            <TouchableOpacity
              activeOpacity={0}
              onPress={async () => {
                // await AsyncStorage.setItem('GiveHealthPerm', 'true');
                setOpenActionSheet(true);
              }}
              style={{
                position: 'absolute',
                flex: 1,
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
                opacity: 0,
              }}></TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <EditManualWeatherModal
        modalVisible={EditManualWeather}
        dismissModalHandler={() => cancelled()}
        verifyDone={EditDone}
        Weather={Weather}
        hours={hours}
        Temp={currentTemp}
        EditTemp={setManualTemp}
        Hour={ManulHours ? ManulHours : hours ? hours : 1}
        EditHour={setManulHours}
        Pollen={ManulPollen}
        EditPollen={setManulPollen}
        WeatherType={ManualWeatherType}
        EditWeatherType={setManualWeatherType}
      />
      <PopUp
        permission={UserData.WeatherPermission}
        image={Constants.Images.WeatherPopUp}
        dataType={'weather'}
        modalVisible={openActionSheet}
        dismissModalHandler={() => setOpenActionSheet(false)}
        verifyDone={() => VerifyDone()}
      />

      <DateExpiredModal
        WeatherPopUp
        modalVisible={WeatherPopUp}
        dismissModalHandler={() => WeatherPopUpcancelled()}
        verifyDone={() => WeatherPopUpcancelled()}
      />

      <AnonymousPopUp
        modalVisible={AnonymousClick}
        dismissModalHandler={() => AnonymousPopUpcancelled()}
        verifyDone={() => AnonymousPopUpcancelled()}
      />

      {/* <WeatherGraphDurationModal
        data={WeatherDurations}
        modalVisible={WeatherDurationModal}
        onChangeText={setWeatherDuration}
        value={WeatherDuration}
        dismissModalHandler={() => setWeatherDurationModal(false)}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Math.ceil(SIZE),
  },
  scrollView: {
    // backgroundColor: '#FFF',
    height: '100%',
    paddingBottom: 400,
  },
  //   body: {
  //     // backgroundColor: '#FFF',
  //   },
  //   sectionContainer: {
  //     marginTop: 32,
  //     paddingHorizontal: 24,
  //   },
  //   sectionTitle: {
  //     fontSize: 24,
  //     fontWeight: '600',
  //     color: '#000',
  //   },
  //   sectionDescription: {
  //     marginTop: 8,
  //     fontSize: 18,
  //     fontWeight: '400',
  //     color: '#555',
  //   },
  //   sectionDescriptionError: {
  //     marginTop: 8,
  //     fontSize: 18,
  //     fontWeight: '400',
  //     color: '#A00000',
  //   },

  WeatherCardMain: {
    flexDirection: 'row',
    width: 320,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
    backgroundColor: '#F1F4F9',
    borderRadius: 18,
    paddingVertical: 20,
    minHeight: 250,
  },
  WeatherCard: {
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingBottom: 8,
  },
  city: {
    paddingVertical: 0,
    color: '#3B456D',
    fontSize: 18,
    fontFamily: RubikRegular,
  },
  CardsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  card2View: {
    width: 120,
    backgroundColor: 'white',
    borderRadius: 15,
    marginRight: 15,
  },
  SmallCardImage: {
    margin: 5,
    height: 20,
    width: 20,
    marginLeft: -5,
  },
  smallCardText: {
    fontFamily: RubikLight,
    fontWeight: '300',
    color: '#8A8BAB',
    fontSize: dynamicSize(13),
    marginBottom: 5,
  },

  ColoredView: {
    height: 40,
    marginHorizontal: dynamicSize(10),
    paddingHorizontal: dynamicSize(20),
    backgroundColor: '#DED6FE',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Card1Text: {
    fontFamily: RubikLight,
    fontWeight: '300',
    color: '#8A8BAB',
    fontSize: dynamicSize(15),
    width: dynamicSize(70),
  },
  HeaderView: {
    height: 80,
    paddingTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  syncButtonView: {
    height: 40,
    width: 40,
    backgroundColor: '#DED6FE',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightText: {
    fontSize: 13,
    color: '#8A8BAB',
    fontFamily: RubikLight,
    // lineHeight: 12,
    // marginVertical: 5,
  },
  normalText: {
    fontSize: 16,
    marginTop: 4,
    // lineHeight: 16,
    fontFamily: RubikRegular,
  },
  ColoredText: {
    fontSize: 16,
    color: '#5947D0',
  },
  ProgressBarView: {
    width: '88%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  //   CircularProgressStyle: {
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     alignSelf: 'center',
  //   },
  SmallThinText: {
    paddingVertical: 12,
    fontFamily: RubikLight,
    color: '#747690',
  },
  //   SmallThinBlackText: {
  //     fontFamily: RubikLight,
  //     // color: '#3B456D',
  //     fontSize: 12.5,
  //   },
  //   wrapper: {
  //     height: 200,
  //     // backgroundColor: 'lightgreen',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     marginBottom: 7,
  //   },
  swiperText: {
    fontSize: SIZE / 14,
    fontWeight: '500',
    width: '75%',
    textAlign: 'center',
    fontFamily: RubikMedium,
    color: '#222432',
  },
  //   forCircle: {alignItems: 'center', justifyContent: 'center', flex: 1},
  //   BigCircleBackgroundImage: {
  //     height: 140,
  //     width: 130,
  //     marginBottom: 16,
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //   },
  //   absolute: {
  //     flex: 1,
  //     position: 'absolute',
  //   },
  indicatorHelper: { height: 18, width: 18, borderRadius: 5 },
  indicatorHelperView: {
    flexDirection: 'row',
    marginHorizontal: 3,
    marginTop: 10,
  },
  indicatorText: {
    marginHorizontal: 10,
    color: '#4C5980',
    fontFamily: RubikRegular,
  },
});

export default WeatherData;

// skeleton placeholder

// ) : (
//   <View
//     style={{
//       backgroundColor: '#F4F6FA',
//       // width: '90%',
//       alignSelf: 'center',
//       minHeight: 300,
//       marginTop: 50,
//       padding: 20,
//       borderRadius: 20,
//     }}>
//     <SkeletonPlaceholder>
//       <SkeletonPlaceholder.Item
//         alignSelf={'center'}
//         width={SIZE / 1.5}
//         height={100}
//         marginTop={40}
//         borderRadius={10}></SkeletonPlaceholder.Item>
//       <View
//         style={{flexDirection: 'row', justifyContent: 'space-around'}}>
//         <SkeletonPlaceholder.Item
//           alignSelf={'center'}
//           width={SIZE / 3.4}
//           height={80}
//           marginTop={40}
//           borderRadius={10}
//         />
//         <SkeletonPlaceholder.Item
//           alignSelf={'center'}
//           width={SIZE / 3.4}
//           height={80}
//           marginTop={40}
//           borderRadius={10}
//         />
//       </View>
//     </SkeletonPlaceholder>
//   </View>
// )}
