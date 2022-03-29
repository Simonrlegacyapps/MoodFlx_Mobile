import React from 'react';
import axios from 'axios';
import {
  getDivisions,
  SetFloCoins,
  UserDivision,
} from '../redux/actions/actions';
import AsyncStorage from '@react-native-community/async-storage';
import {onUnlinkUpdate, setPrevFloCoins} from '../services/commonService';
import {getApiBaseUrl} from '../Constants/constants';
import isFunction from 'lodash.isfunction';

const PostRequestApi = async (url, params) => {
  return await axios.post(getApiBaseUrl() + url, params).then((resp) => {
    return resp;
  });
};

export async function GetStaffUserData(
  params,
  dispatch,
  isNotCheckUserBlocked = false,
) {
  console.log(`params of get user profile`, params)
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify(params);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

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
      if (!isNotCheckUserBlocked && result?.userData?.status === 2) {
        onUnlinkUpdate(dispatch);
      }
      return result;
    })
    .catch((error) =>
      console.log('❌ ❌ ❌ ❌ Error Get Staff User Data ❌ ❌ ❌ ❌', error),
    );
}

export async function getDivisionName(
  params,
  dispatch,
  isUnlinkAllowed,
  onFinish,
) {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify(params);
  let isFinished = false;
  GetStaffUserData(params, dispatch)
    .then(async (result) => {
      // return new Promise((resolve, reject) => {
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
                if (params?.email && params?.user_id) {
                  const p = {
                    email: params?.email,
                    user_id: params?.user_id,
                  };
                  PostRequestApi('unlinkToCompany', p)
                    .then(async (resp) => {
                      console.log('unlinkToCompany api Success');
                      onUnlinkUpdate(dispatch);
                    })
                    .catch((err) => {
                      console.log('unlink api failed error: ', err);
                    });
                }
              }
              // console.log('getDivision data =>', res.data.data);
            }
            if (!isFinished && typeof onFinish === 'function') {
              isFinished = true;
              onFinish(true);
            }
            // console.log('divisionName: ', divisionName);
            // resolve(divisionName ? divisionName : false);
          })
          .catch((e) => {
            // resolve(false);
            console.log('error getting diviision', e);
            if (!isFinished && typeof onFinish === 'function') {
              isFinished = true;
              onFinish(true);
            }
          });
      } else {
        if (!isFinished && typeof onFinish === 'function') {
          isFinished = true;
          onFinish(true);
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

export default PostRequestApi;
