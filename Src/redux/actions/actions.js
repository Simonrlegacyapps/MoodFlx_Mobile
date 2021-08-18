import {
  FIRST_ACTION_TYPE,
  GET_DIVISION,
  OTP_VERIFIED,
  SET_DIVISION,
  GET_EMAIL,
  GET_USER_DIVISION,
  GET_USER_MOOD_COUNT,
  GET_USER_STEPS,
  GET_USER_CALORIES,
  GET_USER_DISTANCE,
  GET_USER_MOVE_TIME,
  GET_HEALTH_PERM,
  GET_ALL_MOODS,
  GET_LAT,
  GET_LONG,
  GET_DAY_STEPS,
  GET_WEATHER_HOUR,
  GET_WEATHER_PERM,
  GET_DAY_TEMP,
  SET_STEPS,
  SET_CALORIES,
  SET_DISTANCE,
  SET_MOVING,
  SET_WORKOUT_TOTAL,
  SET_DOB,
  USER_ID,
  USER_DETAIL,
  IS_ANONYMOUS,
  COMPANY_NAME,
  GET_SLEEP_PERM,
  SET_NOTIFICATION,
  GET_NOTIFICATION_PERM,
  SET_LOCATION,
  WEEKLY_INSIGHTS_TIME_LEFT,
  SHOW_WEEKLY_INSIGHTS_MODAL,
  SET_SWIPER_INDEX,
  SET_FLO_COINS,
  SET_FITNESS_SYNC_TEXT,
  SET_SLEEP_DATA_SYNC_STATUS,
  SET_WEATHER_INSIGHTS,
} from '../constants/action-types';

export const FIRST_ACTION = (data) => {
  return {
    type: FIRST_ACTION_TYPE,
    payload: data,
  };
};
export const OTP_Verify = (data) => {
  return {
    type: OTP_VERIFIED,
    payload: data,
  };
};
export const Division = (data) => {
  return {
    type: SET_DIVISION,
    payload: data,
  };
};
export const getDivisions = (data) => {
  return {
    type: GET_DIVISION,
    payload: data,
  };
};
export const UserEmail = (data) => {
  return {
    type: GET_EMAIL,
    payload: data,
  };
};
export const UserDivision = (data) => {
  return {
    type: GET_USER_DIVISION,
    payload: data,
  };
};
export const UserMoodCount = (data) => {
  return {
    type: GET_USER_MOOD_COUNT,
    payload: data,
  };
};
export const UserSteps = (data) => {
  return {
    type: GET_USER_STEPS,
    payload: data,
  };
};
export const UserCalories = (data) => {
  return {
    type: GET_USER_CALORIES,
    payload: data,
  };
};
export const UserDistance = (data) => {
  return {
    type: GET_USER_DISTANCE,
    payload: data,
  };
};
export const UserMoveTime = (data) => {
  return {
    type: GET_USER_MOVE_TIME,
    payload: data,
  };
};
export const HealthPerm = (data) => {
  return {
    type: GET_HEALTH_PERM,
    payload: data,
  };
};
export const NotificationPerm = (data) => {
  return {
    type: GET_NOTIFICATION_PERM,
    payload: data,
  };
};
export const WeatherPerm = (data) => {
  return {
    type: GET_WEATHER_PERM,
    payload: data,
  };
};
export const SleepPerm = (data) => {
  return {
    type: GET_SLEEP_PERM,
    payload: data,
  };
};
export const Moods = (data) => {
  return {
    type: GET_ALL_MOODS,
    payload: data,
  };
};
export const Lat = (data) => {
  return {
    type: GET_LAT,
    payload: data,
  };
};
export const Long = (data) => {
  return {
    type: GET_LONG,
    payload: data,
  };
};
export const DaySteps = (data) => {
  return {
    type: GET_DAY_STEPS,
    payload: data,
  };
};
export const WeatherTypehours = (data) => {
  return {
    type: GET_WEATHER_HOUR,
    payload: data,
  };
};
export const DayTemp = (data) => {
  return {
    type: GET_DAY_TEMP,
    payload: data,
  };
};
export const GetSteps = (data) => {
  return {
    type: SET_STEPS,
    payload: data,
  };
};
export const GetCalories = (data) => {
  return {
    type: SET_CALORIES,
    payload: data,
  };
};
export const GetDistance = (data) => {
  return {
    type: SET_DISTANCE,
    payload: data,
  };
};
export const GetMovingTime = (data) => {
  return {
    type: SET_MOVING,
    payload: data,
  };
};
export const GetWorkouts = (data) => {
  return {
    type: SET_WORKOUT_TOTAL,
    payload: data,
  };
};
export const GetDOB = (data) => {
  return {
    type: SET_DOB,
    payload: data,
  };
};
export const GetUserId = (data) => {
  return {
    type: USER_ID,
    payload: data,
  };
};
export const UserDetail = (data) => {
  return {
    type: USER_DETAIL,
    payload: data,
  };
};
export const IsAnonymous = (data) => {
  return {
    type: IS_ANONYMOUS,
    payload: data,
  };
};
export const CompanyName = (data) => {
  return {
    type: COMPANY_NAME,
    payload: data,
  };
};

export const SetNotification = (data) => {
  return {
    type: SET_NOTIFICATION,
    payload: data,
  };
};

export const SetLocation = (data) => {
  return {
    type: SET_LOCATION,
    payload: data,
  };
};

export const SetWeeklyInsightsTimeLeft = (data) => {
  return {
    type: WEEKLY_INSIGHTS_TIME_LEFT,
    payload: data,
  };
};

export const SetShowWeeklyInsightsModal = (data) => {
  return {
    type: SHOW_WEEKLY_INSIGHTS_MODAL,
    payload: data,
  };
};

export const SetSwiperIndex = (data) => {
  return {
    type: SET_SWIPER_INDEX,
    payload: data,
  };
};

export const SetFloCoins = (data) => {
  return {
    type: SET_FLO_COINS,
    payload: data,
  };
};

export const SetFitnessSyncText = (data) => {
  return {
    type: SET_FITNESS_SYNC_TEXT,
    payload: data,
  };
};

export const SetSleepDataSyncStatus = (data) => {
  return {
    type: SET_SLEEP_DATA_SYNC_STATUS,
    payload: data,
  };
};

export const SetWeatherInsights = (data) => {
  return {
    type: SET_WEATHER_INSIGHTS,
    payload: data,
  };
};
