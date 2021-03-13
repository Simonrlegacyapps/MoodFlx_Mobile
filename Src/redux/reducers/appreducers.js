import {FIRST_ACTION_TYPE, OTP_VERIFIED} from '../constants/action-types';

const intializedState = {
  OTPVerified: false,
};

export const First = (state = intializedState, action) => {
  switch (action.type) {
    case FIRST_ACTION_TYPE:
      return [...state];
    case OTP_VERIFIED:
      console.log('action.data', action);
      return Object.assign({}, state, {
        isFetching: true,
        userData: {},
        isError: false,
      });
    default:
      return state;
  }
};
