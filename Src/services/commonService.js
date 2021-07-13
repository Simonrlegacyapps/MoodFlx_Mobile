import {
  GetUserId,
  HealthPerm,
  IsAnonymous,
  UserDetail,
  UserDivision,
  UserEmail,
} from '../redux/actions/actions';
import AsyncStorage from '@react-native-community/async-storage';
import isFunction from 'lodash.isfunction';

export async function onUnlinkUpdate(dispatch, onFinish) {
  try {
    await AsyncStorage.removeItem('UserId');
    await AsyncStorage.removeItem('Anonymous');
    await AsyncStorage.removeItem('Email');
    await AsyncStorage.removeItem('Division');
    await AsyncStorage.removeItem('Email');
    dispatch?.(UserDivision(null));
    dispatch?.(UserEmail(null));
    dispatch?.(GetUserId(null));
    dispatch?.(IsAnonymous(true));
    dispatch?.(UserDetail(null));
    if (isFunction(onFinish)) {
      onFinish(true);
    }
    return true;
  } catch (error) {
    if (isFunction(onFinish)) {
      onFinish(false);
    }
    return false;
  }
}

export async function onDynamicLinkUpdate(userData, dispatch, onFinish) {
  if (!userData || !dispatch) {
    if (isFunction(onFinish)) {
      onFinish(false);
    }
    return false;
  }
  try {
    if (userData?.email) {
      const isEmailSet = await AsyncStorage.setItem(
        'Email',
        JSON.stringify(userData.email),
      );
      dispatch(UserEmail(userData.email));
    }
  } catch (error) {
    console.log('error in AsyncStorage set item for Email');
  }
  try {
    if (userData?.user_id) {
      const isUserIdSet = await AsyncStorage.setItem(
        'UserId',
        JSON.stringify(userData.user_id),
      );
      dispatch(GetUserId(userData.user_id));
    }
  } catch (error) {
    console.log('error in AsyncStorage set item for UserId');
  }
  if (isFunction(onFinish)) {
    onFinish(userData);
  }
}

export const getBulbColorFromLux = (v) => {
  if (!isNaN(v)) {
    v = Number(v);
    if (v >= 0 && v <= 100) {
      return '#f9eac8';
    } else if (v > 100 && v <= 200) {
      return '#ead092';
    } else if (v > 200 && v <= 300) {
      return '#f9dd80';
    } else if (v > 300 && v <= 400) {
      return '#ead251';
    } else if (v > 400) {
      return '#dcbc36';
    }
  } else {
    return '#dcbc36';
  }
};
