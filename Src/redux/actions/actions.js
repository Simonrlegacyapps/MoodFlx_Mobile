import {
  FIRST_ACTION_TYPE,
  GET_DIVISION,
  OTP_VERIFIED,
  SET_DIVISION,
  GET_EMAIL,
  GET_USER_DIVISION,
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
