import {
  FIRST_ACTION_TYPE,
  GET_ALL_MOODS,
  GET_DAY_STEPS,
  GET_DIVISION,
  GET_EMAIL,
  GET_HEALTH_PERM,
  GET_LAT,
  GET_LONG,
  GET_USER_CALORIES,
  GET_USER_DISTANCE,
  GET_USER_DIVISION,
  GET_USER_MOOD_COUNT,
  GET_USER_MOVE_TIME,
  GET_USER_STEPS,
  OTP_VERIFIED,
  SET_DIVISION,
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
  AllMoods: null,
  lat: null,
  lon: null,
  TodayAllSteps: null,
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
    default:
      return state;
  }
};
