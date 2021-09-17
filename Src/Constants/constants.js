export const PHOTO_URL = 'https://admin.moodflo.com/';
import moment from 'moment';

export const PRIVACY_POLICY_URL = 'https://moodflo.com/privacy-policy';
export const TERMS_OF_USE_URL = 'https://moodflo.com/terms-of-use';

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
  return [
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
      name: dataTypes.screenTime,
      permission: false,
      priority: 5,
    },
  ];
};

export const getWeeklyInsightsAvailable = () => {
  const day = moment().day();
  let startTime = moment().set({
    hour: 12,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  let endTime = moment().set({
    hour: 18,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  if (day === 5) {
    endTime = moment().add(1, 'day').set({
      hour: 18,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  } else if (day === 6) {
    startTime = moment().subtract(1, 'day').set({
      hour: 12,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  }
  if (
    !isNaN(day) &&
    (Number(day) === 5 || Number(day) === 6) &&
    moment().isSameOrAfter(startTime) &&
    moment().isSameOrBefore(endTime)
  ) {
    return true;
  } else {
    return false;
  }
};

export const getWeeklyInsightsDaysLeft = () => {
  const day = moment().day();
  let startTime = moment().set({
    hour: 12,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  let endTime = moment().set({
    hour: 18,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  if (day === 5) {
    endTime = moment().add(1, 'day').set({
      hour: 18,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  } else if (day === 6) {
    startTime = moment().subtract(1, 'day').set({
      hour: 12,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  }
  if (getWeeklyInsightsAvailable() === true) {
    return 0;
  } else {
    if (day <= 5) {
      startTime = moment()
        .add(5 - day, 'day')
        .set({
          hour: 12,
          minute: 0,
          second: 0,
          millisecond: 0,
        });
    } else {
      startTime = moment()
        .add(7 - day + 5, 'day')
        .set({
          hour: 12,
          minute: 0,
          second: 0,
          millisecond: 0,
        });
    }
    const duration = moment.duration(startTime.diff(moment())).as('days');
    return Math.ceil(Number(duration));
  }
};
