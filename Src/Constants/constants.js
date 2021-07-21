export const PHOTO_URL = 'https://admin.moodflo.com/';
import moment from 'moment';

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
  latitude: '37.811262',
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
