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
