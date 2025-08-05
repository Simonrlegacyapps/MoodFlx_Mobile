import React from 'react';
import axios from 'axios';
import {
  getDivisions,
  SetFloCoins,
  UserDetail,
  UserDivision,
} from '../redux/actions/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getMyDeviceId, onUnlinkUpdate, setPrevFloCoins} from '../services/commonService';
import {getApiBaseUrl} from '../Constants/constants';
import isFunction from 'lodash.isfunction';
import getStore from '../redux';
import { logger } from '../..';

const PostRequestApi = async (url, params) => {
  axios.defaults.timeout = 10000000000;
  return await axios.post(getApiBaseUrl() + url, params).then((resp) => {
    // logger("Response =",resp)
    return resp;
  }).catch(err=>{
    logger("Catch erro =", err)
  });
};

export async function GetStaffUserData(
  message,
  params,
  dispatch,
  isNotCheckUserBlocked = false,
) {
  console.log(`params of get user profile`, params)
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify(params);
logger("raw", raw)
logger(message,"getStaffUserData raw123789", raw)
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  logger("TESING getStaffUserData", requestOptions)

  return await fetch(`${getApiBaseUrl()}getStaffUserData`, requestOptions)
    .then((response) => response.json())
    .then(async (result) => {
      console.log(
        '✅ ✅ ✅ ✅ Success Get Staff User Data ✅ ✅ ✅ ✅',
        result?.userData,
      );
      if (!isNaN(result?.userData?.reward_point)) {
        // console.log('result.userData.reward_point ----', Number(result.userData.reward_point));
        dispatch(SetFloCoins(Number(result.userData.reward_point)));
      }
      if (
        !isNotCheckUserBlocked && 
        (result?.userData?.status === 2 || result?.userData?.status === 3)
      ) {
        // unlinkFromCompany(message,params, dispatch);
        // onUnlinkUpdate(dispatch);
      }
      return result;
    })
    .catch((error) =>
      console.log('❌ ❌ ❌ ❌ Error Get Staff User Data ❌ ❌ ❌ ❌', error),
    );
}

export const unlinkFromCompany = (message,params, dispatch, onFinish) => {
  if (params?.email && params?.user_id) {
    let unlinkReason = {
      id: 4,
      fileName: "PostRequestApi",
      email: params?.email,
      user_id: params?.user_id,
      message:message,
      paramsFromOthers:params,
    }
    const p = {
      email: params?.email,
      user_id: params?.user_id,
      unlink_reason: JSON.stringify(unlinkReason)
    };
    PostRequestApi('unlinkToCompany', p)
      .then(async (resp) => {
        console.log('unlinkToCompany api Success');
        onUnlinkUpdate(dispatch, onFinish);
      })
      .catch((err) => {
        console.log('unlink api failed error: ', err);
      });
  }
};

export async function getDivisionName(
  message,
  params,
  dispatch,
  isUnlinkAllowed,
  onFinish,
) {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify(params);
  let isFinished = false;
  const message2 = "from PostRequestApi, inside getDivisionName() method===> MESSAGE from getDivisionName() method" + message;
  logger("TESTING GetStaffUserData calling");
  GetStaffUserData(message2,params, dispatch)
    .then(async (result) => {
      // return new Promise((resolve, reject) => {
      logger("TESTING GetStaffUserData called",result?.userData?.status);
      
      if (result?.userData?.status !== 2) {
        axios
          .post(`${getApiBaseUrl()}getAllDivision`, params)
          .then((res) => {
            let divisionName = '';
            if (Array.isArray(res?.data?.data)) {
              const divisions = res.data.data.filter((e) => {
                if ((e?.total_staff ?? -1) === -1) {
                  return true;
                } else if (
                  e.total_staff > (e?.onboard_staff ?? 0) ||
                  (result?.userData?.division_id ?? '-1') === (e?.id ?? '-2')
                ) {
                  return true;
                } else {
                  return false;
                }
              });
              dispatch(getDivisions(divisions));
              logger("TESTING GetStaffUserData called CHECK FOR DIVISION ID",result?.userData?.division_id);
              // console.log('getDivisions success dispatch getDivision');
              if (result?.userData?.division_id) {
                res.data.data.forEach((e) => {
                  if (!divisionName) {
                    divisionName =
                      e.id === result.userData.division_id ? e?.name ?? '' : '';
                  }
                });
                if (typeof divisionName === 'string' && divisionName) {
                  // console.log('dispatch UserDivision: ', divisionName);
                  dispatch?.(UserDivision(divisionName));
                  // AsyncStorage.setItem('Division', divisionName)
                  //   .then((r) => {
                  //     // console.log('AsyncStorate set division success', r);
                  //   })
                  //   .catch((e) =>
                  //     console.log('AsyncStorage set division error', e),
                  //   );
                }
              } else if (isUnlinkAllowed) {
                // if (params?.email && params?.user_id) {
                //   let unlinkReason = {
                //     id: 5,
                //     fileName: "PostRequestApi",
                //     email: params?.email,
                //     user_id: params?.user_id,
                //     paramsFromOthers: params,
                //     message: message,
                //     isUnlinkAllowed: isUnlinkAllowed,
                //     reason:"isUnlinkAllowed is allowed and inside getDivisionName()->GetStaffUserData() method"
                //   }
                //   logger("TESTING unlinkReason",JSON.stringify(unlinkReason));
                  
                //   const p = {
                //     email: params?.email,
                //     user_id: params?.user_id,
                //     unlink_reason: JSON.stringify(unlinkReason)
                //   };
                //   PostRequestApi('unlinkToCompany', p)
                //     .then(async (resp) => {
                //       console.log('unlinkToCompany api Success');
                //       logger('TESTING unlinkToCompany api Success');
                //       onUnlinkUpdate(dispatch);
                //     })
                //     .catch((err) => {
                //       console.log('unlink api failed error: ', err);
                //       logger('TESTING unlink api failed error: ', err);
                //     });
                // }
              }
              // console.log('getDivision data =>', res.data.data);
            }
            if (!isFinished && typeof onFinish === 'function') {
              isFinished = true;
              onFinish(true, result?.userData);
            }
            // console.log('divisionName: ', divisionName);
            // resolve(divisionName ? divisionName : false);
          })
          .catch((e) => {
            // resolve(false);
            console.log('error getting diviision', e);
            if (!isFinished && typeof onFinish === 'function') {
              isFinished = true;
              onFinish(true, result?.userData);
            }
          });
      } else {
        if (!isFinished && typeof onFinish === 'function') {
          isFinished = true;
          onFinish(true, result?.userData);
        }
        // resolve(false);
      }
      // });
    })
    .catch((error) => {
      console.log('❌ ❌ ❌ ❌ Error Get Staff User Data ❌ ❌ ❌ ❌', error);
      if (!isFinished && typeof onFinish === 'function') {
        isFinished = true;
        onFinish(true);
      }
    });
}

export function getUpdateRewardPoint(params, dispatch, onError) {
  console.log('params getUpdateRewardPoint', params);
  return PostRequestApi('getUpdateRewardPoint', params)
    .then((res) => {
      console.log(
        '✅ ✅ ✅ ✅ Success getUpdateRewardPoint ✅ ✅ ✅ ✅',
        res?.data,
      );
      if (!isNaN(res?.data?.reward_point)) {
        // console.log('resp.data.reward_point ----', Number(resp.data.reward_point));
        setPrevFloCoins(Number(res.data.reward_point));
        dispatch(SetFloCoins(Number(res.data.reward_point)));
      }
      return Promise.resolve(res);
    })
    .catch((err) => {
      console.log('❌ ❌ ❌ ❌ Error getUpdateRewardPoint ❌ ❌ ❌ ❌', err);
      if (isFunction(onError)) {
        onError();
      }
    });
}

export function getRewardsListApi(params, onError) {
  console.log('params getUpdateRewardPoint', params);
  return PostRequestApi('availableRewardList', params)
    .then((res) => {
      console.log(
        '✅ ✅ ✅ ✅ Success availableRewardList Api ✅ ✅ ✅ ✅',
        res?.data,
      );
      return Promise.resolve(res?.data?.rewardData ?? []);
    })
    .catch((err) => {
      console.log('❌ ❌ ❌ ❌ Error availableRewardList api ❌ ❌ ❌ ❌', err);
      if (isFunction(onError)) {
        onError();
      }
    });
}

export const updateNameInProfileApi = (requestData, dispatch) => {
  if (!requestData) {
    return;
  }
  const deviceId = getMyDeviceId();
  if (!dispatch) {
    dispatch = getStore?.()?.dispatch;
  }
  var myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('Content-Type', 'application/json');

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(requestData),
    redirect: 'follow',
  };

  console.log(`requestData`, requestData);
  const staffUserDataRequest = {
    device_id: deviceId,
    email: requestData.email,
    user_id: requestData.user_id,
  };
  const message = "from PostRequestApi, inside updateNameInProfileApi() method";
  GetStaffUserData(message,staffUserDataRequest, dispatch)
    .then(async (result) => {
      // console.log(
      //   '✅ ✅ ✅ ✅ Success Get Staff User Data ✅ ✅ ✅ ✅',
      //   result?.userData
      // );
      if (result?.userData?.status !== 2) {
        return fetch(`${getApiBaseUrl()}updateStaffProfile`, requestOptions);
      } else {
        requestData.email = '';
        requestData.user_id = '';
        requestOptions.body = JSON.stringify(requestData);
        return fetch(`${getApiBaseUrl()}updateStaffProfile`, requestOptions);
      }
    })
    .then(async (result) => {
      if (result) {
        // console.log('profile updated', result), getProfileUserData();
        console.log(
          '✅ ✅ ✅ ✅ Success Update Staff Profile ✅ ✅ ✅ ✅',
          result,
        );
        fetchAndUpdateUserDetail(staffUserDataRequest, dispatch);
      }
    })
    .catch((error) => console.log('❌ ❌ ❌ ❌ Error Update Staff Profile ❌ ❌ ❌ ❌', error));

};

const fetchAndUpdateUserDetail = (requestData, dispatch) => {
  const deviceId = getMyDeviceId();
  if (!dispatch) {
    dispatch = getStore?.()?.dispatch;
  }
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  if (!requestData) {
    requestData = {
      device_id: deviceId,
      email: getStore?.()?.getState?.()?.First?.UserEmail,
      user_id: getStore?.()?.getState?.()?.First?.UserId,
    };
  }
  var raw = JSON.stringify(requestData);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  console.log('fetchAndUpdateUserDetail getStafUserData params --->', raw);
  fetch(`${getApiBaseUrl()}getStaffUserData`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(
        '✅ ✅ ✅ ✅ Success Get Staff User Data ✅ ✅ ✅ ✅',
        result.userData,
      );
      dispatch?.(UserDetail(result.userData));
    })
    .catch((error) => console.log('error', error));
};

export const checkAndUpdateUserIfBlocked = (dispatch) => {
  const userData = getStore?.()?.getState?.()?.First;
  const deviceId = getMyDeviceId();
  const message = "from PostRequestApi, inside checkAndUpdateUserIfBlocked() method";
  GetStaffUserData(message,
    {
      device_id: deviceId,
      email: userData.UserEmail,
      user_id: userData.UserId,
    },
    dispatch,
  );
};

export default PostRequestApi;
