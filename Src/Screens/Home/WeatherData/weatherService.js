import AsyncStorage from '@react-native-community/async-storage';
import Geocoder from 'react-native-geocoding';
import {
  defaultLocation,
  getApiBaseUrl,
  getWeeklyInsightsAvailable,
  isCountryIndia,
  weatherApiDataTypes,
  weatherTypes,
} from '../../../Constants/constants';
import GetLocation from 'react-native-get-location';
import moment from 'moment';
import axios from 'axios';
import getStore from '../../../redux';
import PostRequestApi from '../../../apirequest/PostRequestApi';
import { SetWeatherInsights } from '../../../redux/actions/actions';
import { getMyDeviceId } from '../../../services/commonService';

export function callWeatherInsightsApi(reset) {
  const store = getStore();
  const deviceId = getMyDeviceId();
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var params = {
    device_id: deviceId,
    email: store?.getState?.()?.First?.UserEmail ?? '',
    user_id: store?.getState?.()?.First?.UserId ?? '',
  };

  console.log(`Weather Insights Api Params`, params);
  if (reset === true) {
    store?.dispatch?.(SetWeatherInsights(null));
  }
  PostRequestApi('getWeatherInsights', {...params, status: 'daily'})
    .then((res) => {
      console.log('✅ ✅ ✅ ✅getWeatherInsights daily success✅ ✅ ✅ ✅: ', res?.data);
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
      store?.dispatch?.(SetWeatherInsights(dailyInsightsPayload));
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
      console.log('✅ ✅ ✅ ✅getWeatherInsights weekly success✅ ✅ ✅ ✅: ', res?.data);
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
      store?.dispatch?.(SetWeatherInsights(weeklyInsightsPayload));
    })
    .catch(function (error) {
      console.log(
        '❌❌❌❌Fail Get Weather Insights ❌❌❌❌',
        error,
        params,
      );
    });
};

export function findWeather(value) {
  const v = value?.toLowerCase?.() ?? value;
  return weatherApiDataTypes?.[v] ?? weatherTypes.Cloudy;
}

export async function syncWeatherData() {
  let lat = -1;
  let lng = -1;
  var city_info = '';
  var state_info = '';
  var country_info = '';
  let location;
  let addressDetails;
  let weatherData;
  let user_id = '';
  let email = '';
  let temp_min = '';
  let temp_max = '';
  let temp = '';
  let device_id = getMyDeviceId();
  const isIndia = isCountryIndia();
  let WeatherP = false;
  try {
    let Wp = await AsyncStorage.getItem('GiveWeatherPerm');
    WeatherP = await JSON.parse(Wp);
  } catch (error) {
    console.log('error getting weather permission from Async storage');
  }
  try {
    let p = await AsyncStorage.getItem('Email');
    email = await JSON.parse(p);
  } catch (error) {
    console.log('error getting email from Async storage');
  }
  try {
    let id = await AsyncStorage.getItem('UserId');
    user_id = await JSON.parse(id);
  } catch (error) {
    console.log('error getting email from Async storage');
  }
  if (!WeatherP || isIndia) {
    lat = defaultLocation.latitude;
    lng = defaultLocation.longitude;
    city_info = defaultLocation.city;
    state_info = defaultLocation.state;
    country_info = defaultLocation.country;
    if (!WeatherP) {
      console.log(
        'Weather update api called with default location because location permission is not given',
      );
    } else {
      console.log(
        'Weather update api called with default location because country is India.',
      );
    }
  } else {
    try {
      location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 15000,
      });
    } catch (error) {
      console.log('error getting location');
    }
  }
  if (location) {
    lat = location?.latitude ?? defaultLocation.latitude;
    lng = location?.longitude ?? defaultLocation.longitude;
  }
  Geocoder.init('AIzaSyD8BafHP8VtNFGyMg4uozFJcgsBaKDxS9s');
  try {
    if (location) {
      addressDetails = await Geocoder.from({
        lat: lat,
        lng: lng,
      });
    }
  } catch (error) {
    console.log('weather api location err', error);
  }
  const address_list = addressDetails?.results?.[0]?.address_components;
  if (Array.isArray(address_list)) {
    for (i = 0; i < address_list.length; i++) {
      if (address_list?.[i]?.types?.includes?.('country')) {
        country_info = address_list[i]?.long_name;
      }
      if (address_list?.[i]?.types?.includes?.('administrative_area_level_1')) {
        state_info = address_list[i]?.long_name;
      }
      if (address_list?.[i]?.types?.includes?.('administrative_area_level_2')) {
        city_info = address_list[i]?.long_name;
      }
    }
  }

  let startTime;
  let startTimeSecond;
  startTime = moment.utc().subtract(1, 'day').startOf('day').toString();
  startTimeSecond = moment.utc().startOf('day').toString();
  console.log('WeatherDayData function loc_lat: ', lat);
  console.log('WeatherDayData function loc_long: ', lng);
  console.log('WeatherDayData function args: ', startTime);
  let hours = 0;
  let weatherRes;
  let weatherResTwo;
  try {
    weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lng}&dt=${
        Date.parse(startTime) / 1000
      }&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
    );
  } catch (error) {
    console.log('error getting yesterday all day weather: ', error);
  }
  try {
    weatherResTwo = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lng}&dt=${
        Date.parse(startTimeSecond) / 1000
      }&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
    );
  } catch (error) {
    console.log('error getting current all day weather: ', error);
  }
  if (weatherRes?.data?.hourly && weatherResTwo?.data?.hourly) {
    let hourlyData = [];
    if (isIndia || !WeatherP) {
      hourlyData = getDefaultTodaysHourlyData(weatherRes?.data?.hourly, weatherResTwo?.data?.hourly)
    } else {
      hourlyData = getLocalTodaysHourlyData(weatherRes?.data?.hourly, weatherResTwo?.data?.hourly)
    }
    weatherData = Object.assign({}, weatherResTwo.data, {
      hourly: Array.isArray(hourlyData) ? [...hourlyData] : [],
    });
    if (weatherRes?.data) {
      // console.log('allDayWeatherData api call success', JSON.stringify(weatherData));
    }
    if (weatherData?.hourly) {
      for (let i in weatherData.hourly) {
        if (
          (weatherData?.current?.weather?.[0]?.description ?? -1) ===
          weatherData?.hourly?.[i]?.weather?.[0]?.description
        ) {
          hours = hours + 1;
        }
      }
    }
  }
  let dailyWeatherRes;
  try {
    dailyWeatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&exclude=hourly,minutely&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
    );
  } catch (error) {
    console.log('error getting current day weather: ', error);
  }
  // console.log('weatherService dailyWeatherRes: ', dailyWeatherRes?.data);
  if (dailyWeatherRes?.data?.main) {
    temp_min = dailyWeatherRes.data.main?.temp_min;
    temp_max = dailyWeatherRes.data.main?.temp_max;
    temp = dailyWeatherRes.data.main?.temp;
    console.log('weatherService temp_min: ', temp_min);
    console.log('weatherService temp_max: ', temp_max);
    console.log('weatherService temp: ', temp);
  }

  const deviceId = getMyDeviceId();
  const data = JSON.stringify({
    user_id,
    email,
    device_id,
    hours,
    weather_type: findWeather(weatherData?.current?.weather?.[0]?.main) ?? null,
    pollen: null,
    pollen_type: 'Low',
    weather_data: weatherData ?? null,
    temp_min,
    temp_max,
    temp,
    city: city_info,
    state: state_info,
    country: country_info,
    lat,
    lon: lng,
  });

  // console.log('weather', data);
  var config = {
    method: 'post',
    url: `${getApiBaseUrl()}updateWeather`,
    headers: {
      'Content-Type': 'application/json',
      Cookie: '__cfduid=de42be196e76a7e54fe0b710d009e4dd11615455418',
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(
        ' ✅ ✅ ✅ ✅ Update Weather Success ✅ ✅ ✅ ✅  params',
        // data,
      );
      callWeatherInsightsApi(true);
    })
    .catch(function (error) {
      console.log(
        '❌❌❌❌ Update Weather Fail ❌❌❌❌',
        error,
        // data
      );
    });
}

export function getDefaultTodaysHourlyData(previousData, currentData) {
  console.log(
    'previousData.lenght: ',
    previousData?.length,
    ' ----currentData.length----',
    currentData?.length,
  );
  if (!(Array.isArray(previousData) && Array.isArray(currentData))) {
    return [];
  }
  let w = [...previousData, ...currentData];
  if (w.length <= 0) {
    return [];
  }
  w = w.filter((e) => {
    const start = moment()
      .utcOffset(defaultLocation.timeZoneOffset)
      .startOf('day')
      .utc();
    const end = moment()
      .utcOffset(defaultLocation.timeZoneOffset)
      .endOf('day')
      .utc();
    // console.log('filter flag e.dt: ', e.dt, '---', moment.utc(e.dt * 1000).isBetween(start, end, undefined, '[]'));
    return (
      !isNaN(e.dt) && moment.utc(e.dt * 1000).isBetween(start, end, undefined, '[]')
    );
  });
  w?.sort?.((a, b) => {
    if (a?.dt && b?.dt) {
      return a.dt - b.dt;
    }
    return -1;
  });
  // console.log('w length ===== ', w.length);
  // console.log('w map to string =====', w.map(e => moment.utc(e.dt * 1000).toString()));
  return w;
}

export function getLocalTodaysHourlyData(previousData, currentData) {
  if (!(Array.isArray(previousData) && Array.isArray(currentData))) {
    return [];
  }
  let w = [...previousData, currentData];
  if (w.length <= 0) {
    return [];
  }
  w.filter(e => {
    const start = moment().startOf('day').utc();
    const end = moment().endOf('day').utc();
    if (e?.dt) {
      return moment.utc(e.dt).isBetween(start, end, undefined, '[]');
    }
    return false;
  });
  w.sort((a, b) => {
    if (a?.dt && b?.dt) {
      return a.dt - b.dt;
    }
    return -1;
  });
  return w;
}
