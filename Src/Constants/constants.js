export const PHOTO_URL = 'https://admin.moodflo.com/';
export const PHOTO_URL_DEV = 'https://dev.moodflo.com/';
export const MOOD_ICONS = 'https://super.moodflo.com/';
export const MOOD_ICONS_DEV = 'https://staging.moodflo.com/';
export const BASE_URL_DEV_API = 'https://dev.moodflo.com/api/';
export const BASE_URL_PRODUCTION_API = 'https://admin.moodflo.com/api/';
import moment from 'moment';
import {Platform} from 'react-native';

export const PRIVACY_POLICY_URL = 'https://moodflo.com/privacy-policy';
export const TERMS_OF_USE_URL = 'https://moodflo.com/terms-of-use';
export const FAQ_URL = 'https://moodflo.com/frequently-asked-questions';

export const getApiBaseUrl = () => {
  if (__DEV__) {
    return BASE_URL_DEV_API;
  } else {
    return BASE_URL_PRODUCTION_API;
  }
};

export const getPhotoUrl = () => {
  if (__DEV__) {
    return PHOTO_URL_DEV;
  } else {
    return PHOTO_URL;
  }
};

export const getMoodIconsUrl = () => {
  if (__DEV__) {
    return MOOD_ICONS_DEV;
  } else {
    return MOOD_ICONS;
  }
};

const getRewardsListApiRequestJson = {
  device_id: 'deice_id',
  email: 'email',
  user_id: 'user_id',
}

const claimRewardsListApiRequestJson = {
  device_id: 'deice_id',
  email: 'email',
  user_id: 'user_id',
  reward_item_id: 'reward_item_id',
  user_name: 'user_name',
  section_index: 6
}

const rewardHistoryRequestJson = {
  device_id: 'deice_id',
  email: 'email',
  user_id: 'user_id',
}

export const hapticsConfigs = {
  car: {
    light: 'impactLight',
    medium: 'impactMedium',
    high: 'impactHeavy',
  },
  heartBeat: {
    light: 'notificationSuccess',
    medium: 'notificationWarning',
    high: 'notificationError',
  },
};

export const hapticsTopFlags = {
  left: 'left',
  right: 'right',
  both: 'both',
};

export const dataTypes = {
  sleep: 'sleep',
  weather: 'weather',
  light: 'light',
  activity: 'activity',
  screenTime: 'screenTime',
  standTime: 'standTime',
  location: 'location',
};

export const durationTypes = {
  daily: 'Daily',
  week: 'Week',
  monthly: 'Monthly',
};

export const weatherTypes = {
  Rainy: 'Rainy',
  Sunny: 'Sunny',
  Cloudy: 'Cloudy',
  Stormy: 'Stormy',
  Snowy: 'Snowy',
};

export const weatherApiDataTypes = {
  'thunderstorm': weatherTypes.Stormy,
  'drizzle': weatherTypes.Rainy,
  'rain': weatherTypes.Rainy,
  'snow': weatherTypes.Snowy,
  'clear': weatherTypes.Sunny,
  'clouds': weatherTypes.Cloudy,

  'mist': weatherTypes.Cloudy,
  'smoke': weatherTypes.Cloudy,
  'haze': weatherTypes.Cloudy,
  'dust': weatherTypes.Sunny,
  'fog': weatherTypes.Cloudy,
  'sand': weatherTypes.Sunny,
  'ash': weatherTypes.Sunny,
  'squall': weatherTypes.Stormy,
  'tornado': weatherTypes.Stormy,
};

export const weatherActions = {
  Rainy: 'Rainfall',
  Sunny: 'Sunny',
  Cloudy: 'Cloudy',
  Stormy: 'Storm',
  Snowy: 'Snowfall',
};

export const defaultLocation = {
  latitude: '-37.8112451',
  longitude: '144.9543962',
  city: 'Melbourne',
  state: 'Victoria',
  country: 'Australia',
  timeZoneOffset: 600,
};

export const isCountryIndia = () => (moment().utcOffset() == 330);

export const moodTypes = {
  regular: 'regular',
  pretty: 'pretty',
  very: 'very',
};

export const getLinkModalText = (existingOrg, newOrg) => {
  return existingOrg && newOrg
    ? `You are currently linked to ${existingOrg}. You will be unlinked if you want to join ${newOrg}.`
    : null;
};

export const getScreensPriority = (data) => {
  // activity, screentime, LIGHT, WEATHER, sleep
  let x = [
    {
      name: dataTypes.activity,
      permission: data?.HealthPermission,
      priority: 1,
    },
    {
      name: dataTypes.light,
      permission: true,
      priority: 2,
    },
    {
      name: dataTypes.weather,
      permission: data?.WeatherPermission,
      priority: 3,
    },
    {
      name: dataTypes.sleep,
      permission: data?.SleepPermission,
      priority: 4,
    },
    {
      name: dataTypes.location,
      permission: data?.WeatherPermission,
      priority: 5,
    },
  ];
  if (Platform.OS === 'android') {
    x.push({
      name: dataTypes.screenTime,
      permission: data?.ScreenTimePermission,
      priority: 6,
    });
  } else if (Platform.OS === 'ios') {
    x.push({
      name: dataTypes.standTime,
      permission: data?.StandTimePermission,
      priority: 6,
    });
  }
  return x;
};

export const getWeeklyInsightsAvailable = () => {
  const day = moment().day() === 0 ? 7 : moment().day();
  if (day >= 4) {
    return true;
  } else {
    return false;
  }
};

export const getWeeklyInsightsDaysLeft = () => {
  const day = moment().day() === 0 ? 7 : moment().day();
  if (getWeeklyInsightsAvailable() === true) {
    return 0;
  } else {
    return (4 - day);
  }
};

export const getMonthlyInsightsStartEndTime = () => {
  let startTime = moment().endOf('month').startOf('day').subtract(4, 'days');
  let endTime = moment().endOf('month');
  return {startTime, endTime};
};

export const getMonthlyInsightsAvailable = () => {
  let startTime = getMonthlyInsightsStartEndTime().startTime;
  let endTime = getMonthlyInsightsStartEndTime().endTime;
  if (moment().isSameOrAfter(startTime) && moment().isSameOrBefore(endTime)) {
    return true;
  } else {
    return false;
  }
};

export const widgetDataGroup = 'group.moodflo';
export const getMonthlyInsightsDaysLeft = () => {
  if (getMonthlyInsightsAvailable() === true) {
    return 0;
  }
  let startTime = getMonthlyInsightsStartEndTime().startTime;
  return (startTime.date() - moment().date());
};

export const defaultNegativeMoodModalData = {
  eap_text: 'Would you like to talk to someone?',
  eap_link: 'https://findahelpline.com/',
};
