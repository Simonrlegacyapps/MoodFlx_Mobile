import {
  FIRST_ACTION_TYPE,
  GET_DIVISION,
  OTP_VERIFIED,
  SET_DIVISION,
} from '../constants/action-types';

const intializedState = {
  OTPVerified: false,
  setDivision: null,
  getDivision: null,
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
    default:
      return state;
  }
};
