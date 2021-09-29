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
import {Platform, Linking, Alert} from 'react-native';
import isEmpty from 'lodash.isempty';
import { activityHealthKitOptions } from './appPermissions';
import moment from 'moment';
import {GetStaffUserData} from '../apirequest/PostRequestApi';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import getStore from '../redux';
import { getApiBaseUrl } from '../Constants/constants';

let moodsArray = [];
let isInitialVideoVisisble = false;
let prevFloCoins = 0;
let divisionSetFlag = false;

export function setDivisionSetFlag(flag = true) {
  divisionSetFlag = flag;
}

export function getDivisionSetFlag() {
  return divisionSetFlag;
}

export function setIsInitialVideoVisible(flag) {
  isInitialVideoVisisble = flag;
}

export function getIsInitialVideoVisible() {
  return isInitialVideoVisisble;
}

export function setPrevFloCoins(v) {
  prevFloCoins = v;
}

export function getPrevFloCoins() {
  return prevFloCoins;
}

export function setMoodsArray(moods) {
  // console.log('setMoodsArray ----', moods);
  if (Array.isArray(moods) && moods.length > 0) {
    moodsArray = moods
      .map((e) => {
        if (typeof e?.name === 'string') {
          if (e.name.toLowerCase() === 'happy') {
            return 'happ';
          }
          return e.name.toLowerCase();
        }
        return '';
      })
      .filter((e) => e !== '');
  }
}

export function getMoodsArray() {
  return moodsArray;
}

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
    const deviceId = DeviceInfo.getUniqueId();
    GetStaffUserData(
      {
        device_id: deviceId,
        email: '',
        user_id: '',
      },
      dispatch,
      true,
    );
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
  // console.log('getFloCoins ----', coins);
  let c = !isNaN(coins) ? String(coins) : -1;
  if (typeof c === 'string') {
    // if (c.length > 4) {
    return c.length > 4 ? coins?.format?.() ?? c : c;
    // }
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
  finalArray = [...Array.isArray(finalArray) ? finalArray : [], ...activityHealthKitOptions.permissions.read];
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
  try {
    await AsyncStorage.setItem('fitnessSyncingData', JSON.stringify(finalArray));
  } catch (error) {
    console.log('error on AsyncStorage set fitnessSyncingData');
  }
};

export const openHealthApp = async () => {
  // Checking if the link is supported for links with custom URL scheme.
  if (Platform.OS !== 'ios') {
    return;
  }
  const url = 'x-apple-health://';
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
    // by some browser in the mobile
    await Linking.openURL(url);
  } else {
    Alert.alert('Unable to open Health App from this app. Please manully open the Health App to make changes');
  }
};

export const setMoodInputTimeStamps = async (isNotes) => {
  let asyncStorageTimeStampKey = isNotes ? 'NotesInputTimeStamp' : 'MoodInputTimeStamp';
  let timeStamps = [];
  try {
    const t = await AsyncStorage.getItem(asyncStorageTimeStampKey);
    if (t) {
      timeStamps = await JSON.parse(t);
    }
  } catch (error) {
    console.log(`Async Storage get ${asyncStorageTimeStampKey} error `, error);
  }
  if (Array.isArray(timeStamps)) {
    timeStamps.sort(function (a, b) {
      return a - b;
    });
    console.log(`setMoodInputTimeStamps ${asyncStorageTimeStampKey} ----`, timeStamps);
    const currentTime = new Date().getTime();
    if (moment(timeStamps[timeStamps.length - 1]).isBefore(moment().startOf('day'))) {
      timeStamps = [];
    }
    timeStamps.push(currentTime);
    AsyncStorage.setItem(asyncStorageTimeStampKey, JSON.stringify(timeStamps));
  }
};

export const getMoodInputRewardPoints = async (isNotes) => {
  let asyncStorageTimeStampKey = isNotes ? 'NotesInputTimeStamp' : 'MoodInputTimeStamp';
  let moodCount = -1;
  let rewardPoints = 0;
  let timeStamps = [];
  try {
    const t = await AsyncStorage.getItem(asyncStorageTimeStampKey);
    if (t) {
      timeStamps = await JSON.parse(t);
    }
  } catch (error) {
    console.log(`Async Storage get ${asyncStorageTimeStampKey} error `, error);
  }
  if (!isNotes) {
    try {
      let p = await AsyncStorage.getItem('MoodCount');
      moodCount = await JSON.parse(p);
      if (!isNaN(moodCount)) {
        moodCount = Number(moodCount);
      }
    } catch (error) {
      console.log(`Async Storage get MoodCount error `, error);
    }
  } else {
    moodCount = timeStamps?.length ?? 0;
  }
  const timeQuarters = [
    {
      startTime: moment().startOf('day').unix() * 1000,
      endTime: moment().startOf('day').hour(6).unix() * 1000,
    },
    {
      startTime: moment().startOf('day').hour(6).unix() * 1000,
      endTime: moment().startOf('day').hour(12).unix() * 1000,
    },
    {
      startTime: moment().startOf('day').hour(12).unix() * 1000,
      endTime: moment().startOf('day').hour(18).unix() * 1000,
    },
    {
      startTime: moment().startOf('day').hour(18).unix() * 1000,
      endTime: moment().endOf('day').unix() * 1000,
    },
  ];
  const currentTime = moment().unix() * 1000;
  if (Array.isArray(timeStamps)) {
    timeStamps.sort(function (a, b) {
      return a - b;
    });
    let existingQuarter = null;
    let l = [];
    if (timeStamps.length === 0) {
      rewardPoints = 3;
    } else {
      timeQuarters.forEach((d, index) => {
        if (currentTime >= d.startTime && currentTime < d.endTime) {
          existingQuarter = d;
        }
      });
      if (existingQuarter) {
        l = timeStamps.filter((e, idx) => {
          return e >= existingQuarter.startTime && e < existingQuarter.endTime;
        });
        if (l.length < 3) {
          const diff = moment().diff(
            moment(timeStamps[timeStamps.length - 1]),
            'minutes',
          );
          if (diff >= 120) {
            rewardPoints = 3;
            if (moodCount >= 3) {
              rewardPoints = rewardPoints + 1;
            }
          }
        }
      }
    }
  }
  // if ((moment().startOf('day').unix() * 1000) )
  // console.log('getMoodInputRewardPoints isNotes rewardpoints ->', isNotes, rewardPoints);
  return rewardPoints;
};

export async function getIsShowNegativeMoodInputPopup(moodId, allMoods) {
  if (!(Array.isArray(allMoods) && allMoods.length > 0)) {
    return false;
  }
  const negativeMoodNames = ['Upset', 'Anxious', 'Sad', 'Tired', 'Cranky', 'Wired', 'Flat', 'Spent'];
  const allNegativeMoods = allMoods
    .filter((e) => negativeMoodNames.indexOf(e?.name) !== -1)
    .map((e) => e.id);
  if (!(moodId && allNegativeMoods.indexOf(moodId) !== -1)) {
    return false;
  }
  let negativeMoodPopupTimeStamp;
  try {
    let p = await AsyncStorage.getItem('NegativeMoodPopupTimeStamp');
    negativeMoodPopupTimeStamp = await JSON.parse(p);
  } catch (error) {
    console.log('Async Storage get MoodCount error ', error);
  }
  if (typeof negativeMoodPopupTimeStamp !== 'number') {
    return false;
  }
  if (moment().startOf('day').diff(moment(negativeMoodPopupTimeStamp).startOf('day'), 'days') < 13) {
    return false;
  }
  const params = {
    "device_id": DeviceInfo?.getUniqueId?.() ?? '',
    "email": getStore?.()?.getState?.()?.First?.UserEmail ?? '',
    "user_id": getStore?.()?.getState?.()?.First?.UserId ?? '',
    "start_date": moment().subtract(13, 'days').format('YYYY-MM-DD'),
  };
  let response;
  try {
    response = await axios.post(`${getApiBaseUrl()}getMoodInputData`, params);
    console.log('✅ ✅ ✅ ✅ Success getMoodInputData response.data✅ ✅ ✅ ✅', response?.data);
  } catch (error) {
    console.error(error);
  }
  if (!response?.data?.moodList) {
    return false;
  }
  let moodInputIdData = [];
  let negativeMoodInputIdData = [];
  let keys = Object.keys(response.data.moodList);
  if (!(Array.isArray(keys) && keys.length > 0)) {
    return false;
  }
  let values = Object.values(response?.data?.moodList);
  if (!(Array.isArray(values) && values.length >= 7)) {
    return false;
  }
  values.forEach((e) => {
    if (Array.isArray(e) && e.length > 0) {
      moodInputIdData = [...moodInputIdData, ...e];
    }
  });
  //console.log('moodInputIdData ->', moodInputIdData);
  if (moodInputIdData.length > 0) {
    negativeMoodInputIdData = moodInputIdData.filter(e => allNegativeMoods.indexOf(e?.mood_id) !== -1);
  }
  let negativeMoodPercentage = 0;
  if (negativeMoodInputIdData.length > 0) {
    negativeMoodPercentage = (negativeMoodInputIdData.length * 100) / moodInputIdData.length;
  }
  if (negativeMoodPercentage > 50) {
    try {
      await AsyncStorage.setItem('NegativeMoodPopupTimeStamp', JSON.stringify(new Date().getTime()));
    } catch (error) {
      console.log('Set NegativeMoodPopupTimeStamp in AsyncStorage error ', error);
    }
    return true;
  }
  console.log('(moodInputIdData.length negativeMoodInputIdData.length---', moodInputIdData.length, negativeMoodInputIdData.length, negativeMoodPercentage);
  return false;
}

export const openUrl = (url) => async () => {
  // Checking if the link is supported for links with custom URL scheme.
  if (typeof url !== 'string') {
    return;
  }
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
    // by some browser in the mobile
    await Linking.openURL(url);
  } else {
    Alert.alert(`Can't open this URL: ${url}`);
  }
};

export function getLvlName(pts) {
  let floCoins = pts ? pts : getStore?.()?.getState?.()?.First?.floCoins;
  if (!isNaN(floCoins)) {
    floCoins = Number(floCoins);
    if (floCoins >= 0 && floCoins <= 100) {
      return {title: 'Mood Activator', type: 'A'};
    } else if (floCoins > 100 && floCoins <= 1000) {
      return {title: 'Mood Navigator', type: 'N'};
    } else if (floCoins > 1000 && floCoins <= 5000) {
      return {title: 'Mood Fit', type: 'F'};
    } else if (floCoins > 5000 && floCoins <= 10000) {
      return {title: 'Mood Powerhouse', type: 'P'};
    } else if (floCoins > 10000) {
      return {title: 'Mood Unleashed', type: 'U'};
    }
  }
  return null;
}

export const getIsMoodLvlUp = (previousPoints, currentPoints) => {
  // console.log('getIsMoodLvlUp previousPoints--', previousPoints, '---currentPoints---', currentPoints);
  if (isNaN(previousPoints)) {
    return false;
  }
  if (isNaN(currentPoints)) {
    return false;
  }
  let prevPts = Number(previousPoints);
  let currentPts = Number(currentPoints);
  if (prevPts >= currentPoints) {
    return false;
  }
  if ((currentPts - prevPts) > 50) {
    return false;
  }
  const prevLvl = getLvlName(prevPts) ?? -1;
  const currentLvl = getLvlName(currentPts) ?? -1;
  console.log('prevLvl --', prevLvl, '--currentLvl---', currentLvl);
  if (
    typeof prevLvl?.title === 'string' &&
    typeof currentLvl?.title === 'string' &&
    prevLvl.title !== currentLvl.title
  ) {
    return true;
  }
  return false;
};

export const getUpdateAnswerRewardPoints = (startDate) => {
  if (typeof startDate !== 'string') {
    return 0;
  }
  const startTime = moment(startDate)
    ?.subtract?.(600, 'minute')
    ?.add?.(moment().utcOffset(), 'minute');
  if (!(startTime && moment.isMoment(startTime))) {
    return 0;
  }
  const diffMinutes = moment().diff(startTime, 'minute');
  if (diffMinutes <= 120) {
    return 8;
  } else if (diffMinutes > 120 && diffMinutes <= 180) {
    return 6;
  } else if (diffMinutes > 180 && diffMinutes <= 240) {
    return 4;
  } else if (diffMinutes > 240 && diffMinutes <= 300) {
    return 2;
  }
  return 0;
};
