import {
  COMPANY_NAME,
  FIRST_ACTION_TYPE,
  GET_ALL_MOODS,
  GET_DAY_STEPS,
  GET_DAY_TEMP,
  GET_DIVISION,
  GET_EMAIL,
  GET_HEALTH_PERM,
  GET_NOTIFICATION_PERM,
  GET_LAT,
  GET_LIGHT_PERM,
  GET_LONG,
  GET_SLEEP_PERM,
  GET_USER_CALORIES,
  GET_USER_DISTANCE,
  GET_USER_DIVISION,
  GET_USER_MOOD_COUNT,
  GET_USER_MOVE_TIME,
  GET_USER_STEPS,
  GET_WEATHER_HOUR,
  GET_WEATHER_PERM,
  IS_ANONYMOUS,
  OTP_VERIFIED,
  SET_CALORIES,
  SET_DISTANCE,
  SET_DIVISION,
  SET_NOTIFICATION,
  SET_LOCATION,
  SET_DOB,
  SET_MOVING,
  SET_STEPS,
  SET_WORKOUT_TOTAL,
  USER_DETAIL,
  USER_ID,
} from '../constants/action-types';

const intializedState = {
  OTPVerified: false,
  setDivision: null,
  getDivision: null,
  UserEmail: null,
  UserDivision: null,
  UserMoodCount: null,
  UserSteps: 0,
  UserCalories: 0,
  UserDistance: 0,
  UserMoveTime: 0,
  HealthPermission: false,
  NotificationPermission: false,
  WeatherPermission: false,
  SleepPermission: false,
  LightPermission: false,
  AllMoods: null,
  lat: null,
  lon: null,
  TodayAllSteps: null,
  WeatherHours: 0,
  DayTemperature: null,
  MainSteps: null,
  MainCalories: null,
  MainDistance: null,
  MainMoving: null,
  MainWorkout: null,
  MainDOB: null,
  UserId: null,
  UserDetails: null,
  Anonymous: true,
  NameCompany: '',
  notification: null,
};

export const First = (state = intializedState, action) => {
  switch (action.type) {
    case FIRST_ACTION_TYPE:
      return [...state];
    case OTP_VERIFIED:
      return Object.assign({}, state, {
        OTPVerified: action.payload,
      });
    case SET_DIVISION:
      return Object.assign({}, state, {
        setDivision: action.payload,
      });
    case GET_DIVISION:
      return Object.assign({}, state, {
        getDivision: action.payload,
      });
    case GET_EMAIL:
      return Object.assign({}, state, {
        UserEmail: action.payload,
      });
    case GET_USER_DIVISION:
      return Object.assign({}, state, {
        UserDivision: action.payload,
      });
    case GET_USER_MOOD_COUNT:
      return Object.assign({}, state, {
        UserMoodCount: action.payload,
      });
    case GET_USER_STEPS:
      return Object.assign({}, state, {
        UserSteps: action.payload,
      });
    case GET_USER_CALORIES:
      return Object.assign({}, state, {
        UserCalories: action.payload,
      });
    case GET_USER_DISTANCE:
      return Object.assign({}, state, {
        UserDistance: action.payload,
      });
    case GET_USER_MOVE_TIME:
      return Object.assign({}, state, {
        UserMoveTime: action.payload,
      });
    case GET_HEALTH_PERM:
      return Object.assign({}, state, {
        HealthPermission: action.payload,
      });
    case GET_NOTIFICATION_PERM:
      return Object.assign({}, state, {
        NotificationPermission: action.payload,
      });
    case GET_SLEEP_PERM:
      return Object.assign({}, state, {
        SleepPermission: action.payload,
      });
    case GET_LIGHT_PERM:
      return Object.assign({}, state, {
        LightPermission: action.payload,
      });
    case GET_ALL_MOODS:
      return Object.assign({}, state, {
        AllMoods: action.payload,
      });
    case GET_LAT:
      return Object.assign({}, state, {
        lat: action.payload,
      });
    case GET_LONG:
      return Object.assign({}, state, {
        lon: action.payload,
      });
    case GET_DAY_STEPS:
      return Object.assign({}, state, {
        TodayAllSteps: action.payload,
      });
    case GET_WEATHER_HOUR:
      return Object.assign({}, state, {
        WeatherHours: action.payload,
      });
    case GET_WEATHER_PERM:
      return Object.assign({}, state, {
        WeatherPermission: action.payload,
      });
    case GET_DAY_TEMP:
      return Object.assign({}, state, {
        DayTemperature: action.payload,
      });
    case SET_STEPS:
      return Object.assign({}, state, {
        MainSteps: action.payload,
      });
    case SET_CALORIES:
      return Object.assign({}, state, {
        MainCalories: action.payload,
      });
    case SET_DISTANCE:
      return Object.assign({}, state, {
        MainDistance: action.payload,
      });
    case SET_MOVING:
      return Object.assign({}, state, {
        MainMoving: action.payload,
      });
    case SET_WORKOUT_TOTAL:
      return Object.assign({}, state, {
        MainWorkout: action.payload,
      });
    case SET_DOB:
      return Object.assign({}, state, {
        MainDOB: action.payload,
      });
    case USER_ID:
      return Object.assign({}, state, {
        UserId: action.payload,
      });
    case USER_DETAIL:
      return Object.assign({}, state, {
        UserDetails: action.payload,
      });
    case IS_ANONYMOUS:
      return Object.assign({}, state, {
        Anonymous: action.payload,
      });
    case COMPANY_NAME:
      return Object.assign({}, state, {
        NameCompany: action.payload,
      });
    case SET_NOTIFICATION:
      return Object.assign({}, state, {
        notification: action.payload,
      });
    case SET_LOCATION:
      return Object.assign({}, state, {
        lat: action.payload?.lat,
        lon: action.payload?.lon,
      });
    default:
      return state;
  }
};
