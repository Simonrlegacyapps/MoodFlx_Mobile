import {
  FIRST_ACTION_TYPE,
  OTP_VERIFIED,
  SET_DIVISION,
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
  console.log('data reaching here', data);
  return {
    type: SET_DIVISION,
    payload: data,
  };
};
