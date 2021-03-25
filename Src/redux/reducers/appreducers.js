import {
  FIRST_ACTION_TYPE,
  GET_DIVISION,
  GET_EMAIL,
  GET_USER_DIVISION,
  OTP_VERIFIED,
  SET_DIVISION,
} from '../constants/action-types';

const intializedState = {
  OTPVerified: false,
  setDivision: null,
  getDivision: null,
  UserEmail: null,
  UserDivision: null,
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
      console.log(`action.payload`, action.payload);
      return Object.assign({}, state, {
        UserEmail: action.payload,
      });
    case GET_USER_DIVISION:
      return Object.assign({}, state, {
        UserDivision: action.payload,
      });
    default:
      return state;
  }
};
