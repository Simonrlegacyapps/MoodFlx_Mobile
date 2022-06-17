import AsyncStorage from '@react-native-community/async-storage';
import Geocoder from 'react-native-geocoding';
import {
  defaultLocation,
  getApiBaseUrl,
  getIsGetCurrentLocationCalled,
  getMonthlyInsightsAvailable,
  getWeeklyInsightsAvailable,
  isCountryIndia,
  pollenValues,
  setIsGetCurrentLocationCalled,
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
      console.log('✅ ✅ ✅ ✅getWeatherInsights daily success✅ ✅ ✅ ✅: ',
      // res?.data
      );
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
          flag: 'current',
        });
      } else {
        return new Promise((resolve, reject) => resolve(null));
      }
    })
    .then((res) => {
      // console.log('getSleepInsights weekly res: ', res);
      let weeklyInsightsPayload = {};
      console.log(
        '✅ ✅ ✅ ✅getWeatherInsights weekly success✅ ✅ ✅ ✅: ',
        // res?.data
      );
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
      if (getMonthlyInsightsAvailable() === true) {
        return PostRequestApi('getWeatherInsights', {
          ...params,
          status: 'monthly',
        });
      } else {
        return new Promise((resolve, reject) => resolve(null));
      }
    })
    .then((res) => {
      // console.log('getSleepInsights weekly res: ', res);
      let monthlyInsightsPayload = {};
      console.log('✅ ✅ ✅ ✅getWeatherInsights monthly success✅ ✅ ✅ ✅: ',
      // res?.data
      );
      monthlyInsightsPayload.monthlyInsights =
        !!res?.data?.insights?.message1 &&
        typeof res.data.insights.message1 === 'string'
          ? res.data.insights.message1
          : '';
      monthlyInsightsPayload.monthlySuggestion =
        !!res?.data?.insights?.message2 &&
        typeof res.data.insights.message2 === 'string'
          ? res.data.insights.message2
          : '';
      monthlyInsightsPayload.monthlySuggestionType =
        !!res?.data?.insights?.message2Type &&
        res?.data?.insights?.message2Type?.toLowerCase?.() === 'warning'
          ? res.data.insights.message2Type
          : '';
      store?.dispatch?.(SetWeatherInsights(monthlyInsightsPayload));
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
  if (WeatherP && getIsGetCurrentLocationCalled() === false) {
    setIsGetCurrentLocationCalled(true);
    try {
      location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 15000,
      });
    } catch (error) {
      console.log('error getting location');
    }
    setIsGetCurrentLocationCalled(false);
  }
  if (location) {
    lat = location?.latitude;
    lng = location?.longitude;
  }
  if (!lat || !lng || lat === -1 || lng === -1) {
    return;
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
    // if (isIndia || !WeatherP) {
    //   hourlyData = getDefaultTodaysHourlyData(weatherRes?.data?.hourly, weatherResTwo?.data?.hourly)
    // } else {
    //   hourlyData = getLocalTodaysHourlyData(weatherRes?.data?.hourly, weatherResTwo?.data?.hourly, weatherResTwo.data.timezone_offset)
    // }
    hourlyData = getLocalTodaysHourlyData(
      weatherRes?.data?.hourly,
      weatherResTwo?.data?.hourly,
      weatherResTwo.data.timezone_offset,
    );
    weatherData = Object.assign({}, weatherResTwo.data, {
      hourly: Array.isArray(hourlyData) ? [...hourlyData] : [],
    });
    // if (weatherRes?.data) {
    //  console.log('allDayWeatherData api call success', JSON.stringify(weatherData));
    // }
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
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=hourly,minutely&appid=549e3cd91b498cafbd020698266c3aa3&units=metric`,
    );
  } catch (error) {
    console.log('error getting current day weather: ', error);
  }
  // console.log('weatherService dailyWeatherRes: ', dailyWeatherRes?.data);
  if (dailyWeatherRes?.data?.current) {
    // console.log('response.data.daily =============--->', JSON.stringify(response.data.daily));
    const timezoneOffset = dailyWeatherRes.data.timezone_offset
    const currentWeather = dailyWeatherRes?.data?.daily?.filter?.((e, idx) => moment.utc(((e.dt + timezoneOffset) * 1000)).date() === moment().date());
    // console.log('WeatherType ===========>>>>>>>>', response?.data?.current?.weather?.[0]?.main);
    temp_min = currentWeather?.[0]?.temp?.min ?? temp_min;
    temp_max = currentWeather?.[0]?.temp?.max ?? temp_max;
    temp = dailyWeatherRes.data?.current?.temp ?? temp;
    console.log('weatherService temp_min: ', temp_min);
    console.log('weatherService temp_max: ', temp_max);
    console.log('weatherService temp: ', temp);
  }

  const data = JSON.stringify({
    user_id,
    email,
    device_id,
    hours,
    weather_type: findWeather(weatherData?.current?.weather?.[0]?.main) ?? null,
    pollen: null,
    // pollen_type,
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
    return 0;
  });
  // console.log('w length ===== ', w.length);
  // console.log('w map to string =====', w.map(e => moment.utc(e.dt * 1000).toString()));
  return w;
}

export function getLocalTodaysHourlyData(
  previousData,
  currentData,
  timezone_offset = 0,
) {
  if (!(Array.isArray(previousData) && Array.isArray(currentData))) {
    return [];
  }
  let w = [...previousData, ...currentData];
  if (w.length <= 0) {
    return [];
  }
  let z = w.map(e => ({dt: e.dt}));
  console.log('w ----->>>>>>>>>', JSON.stringify(z));
  w = w.filter(e => {
    const start = moment.utc(
      moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      'YYYY-MM-DD HH:mm:ss',
    );
    const end = moment.utc(
      moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      'YYYY-MM-DD HH:mm:ss',
    );
    if (e.dt) {
      return moment
        .utc((e.dt + timezone_offset) * 1000)
        .isBetween(start, end, undefined, '[]');
    }
    return false;
  });
  w.sort((a, b) => {
    if (a?.dt && b?.dt) {
      return a.dt - b.dt;
    }
    return 0;
  });
  // console.log('currentDay Hourly ---===========>>>>>>> ', timezone_offset, ' --- ', JSON.stringify(w));
  return w;
}

export function getSortedWeatherData(l) {
  let result = [];
  let sortedList = [...l];
  let weeklyDates = [0, 1, 2, 3, 4, 5, 6];
  let sortedData = {};
  weeklyDates = weeklyDates.map(e =>
    moment().subtract(e, 'days').format('YYYY-MM-DD'),
  );
  sortedList.forEach(e => {
    sortedData[e.date] = e;
  });
  weeklyDates.forEach(e => {
    const label = moment(e, 'YYYY-MM-DD').format('dd');
    if (sortedData?.[e]) {
      result.push({
        ...sortedData[e],
        rainfall: sortedData[e].rainfall && !isNaN(sortedData[e].rainfall) ? Number(sortedData[e].rainfall) : 0,
        label,
      });
    } else {
      result.push({
        "date": e,
        "temp_min": null,
        "temp_max": null,
        "pollen": null,
        "pollen_type": null,
        "rainfall": 0,
        "label": label,
      });
    }
  });
  result.sort(function (a, b) {
    let itemOneData = a.date ? moment(a.date, 'YYYY-MM-DD') : null;
    let itemTwoData = b.date ? moment(b.date, 'YYYY-MM-DD') : null;
    if (!itemOneData || !itemTwoData || itemOneData.isSame(itemTwoData)) {
      return 0;
    } else {
      return itemOneData.isAfter(itemTwoData) ? 1 : -1;
    }
  });
  return result;
}

export function getRainHrsFromHourlyWeather(hourlyWeather) {
  // console.log('hourlyWeather ===================>>>>>>>>>', JSON.stringify(hourlyWeather));
  let rainHrs = hourlyWeather?.filter?.(e => !!e.rain)?.length ?? 0;
  return rainHrs;
}

export function getPollenTypeFromWeatherData(d) {
  if (Array.isArray(d) && d.length > 0) {
    const currentDate = moment().format('YYYY-MM-DD');
    const currentDayPollenType = d.filter(e => e?.date === currentDate)?.[0]?.pollen_type ?? null;
    const v = pollenValues.filter(e => e?.name?.toLowerCase?.() === currentDayPollenType?.toLowerCase?.())?.[0]?.name ?? null;
    if (v) {
      // console.log('setManualPollen ---->>>>>>', v);
      return v;
    }
  }
  return '';
}
