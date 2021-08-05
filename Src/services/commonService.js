import {
  GetUserId,
  HealthPerm,
  IsAnonymous,
  SetFitnessSyncText,
  SetSwiperIndex,
  UserDetail,
  UserDivision,
  UserEmail,
} from '../redux/actions/actions';
import AsyncStorage from '@react-native-community/async-storage';
import isFunction from 'lodash.isfunction';
import { Platform } from 'react-native';
import isEmpty from 'lodash.isempty';
import { activityHealthKitOptions } from './appPermissions';

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

export const setSwiperIndexHome = (i, dispatch) => {
  dispatch?.(SetSwiperIndex(i));
};

export const getFloCoins = (coins) => {
  let c = !isNaN(coins) ? String(coins) : -1;
  if (typeof c === 'string') {
    if (c.length > 4) {
      return c.length > 4 ? coins?.format?.() ?? c : c;
    }
  } else {
    return coins ?? 0;
  }
};

export const setFitnessDataSync = async (dispatch, dataSyncArray) => {
  let Hp = await AsyncStorage.getItem('GiveHealthPerm');
  let HealthP = await JSON.parse(Hp);
  if (Platform.OS === 'android') {
    dispatch?.(SetFitnessSyncText(HealthP ? 'Syncing your' : 'Sync your'));
    return;
  }
  let finalArray;
  let dataArray;
  try {
    const fd = await AsyncStorage.getItem('fitnessSyncingData');
    dataArray = await JSON.parse(fd);
  } catch (error) {
    console.log('error getting fitnessSyncingData from Async storage');
  }

  if (Array.isArray(dataArray) && !isEmpty(dataArray)) {
    if (Array.isArray(dataSyncArray)) {
      finalArray = [...dataArray, ...dataSyncArray];
      // console.log('remove duplicates from this array ===', finalArray);
      //removing duplicates
      finalArray = finalArray.filter((v, idx) => finalArray.indexOf(v) === idx);
      // console.log('duplicates removed ===', finalArray);
    } else {
      finalArray = [...dataArray];
    }
  } else if (Array.isArray(dataSyncArray) && !isEmpty(dataSyncArray)) {
    finalArray = [...dataSyncArray];
  }
  finalArray = [...finalArray, ...activityHealthKitOptions.permissions.read];
  // console.log('keep duplicates in this array ===', finalArray);
  //getting duplicates
  finalArray = finalArray.filter((v, idx) => finalArray.indexOf(v) !== idx);
  console.log('fitness data syncing array ===', finalArray);
  let text = `0/${activityHealthKitOptions.permissions.read.length}`;
  if ((finalArray?.length ?? 0) <= activityHealthKitOptions.permissions.read.length) {
    text = `Syncing ${finalArray?.length}/${activityHealthKitOptions.permissions.read.length}`;
  } else {
    text = `Syncing ${activityHealthKitOptions.permissions.read.length}/${activityHealthKitOptions.permissions.read.length}`;
  }
  dispatch?.(SetFitnessSyncText(text));
};
