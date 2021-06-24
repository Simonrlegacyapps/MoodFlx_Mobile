import React from 'react';
import axios from 'axios';
import {
  getDivisions,
  GetUserId,
  IsAnonymous,
  UserDetail,
  UserDivision,
  UserEmail,
} from '../redux/actions/actions';
import AsyncStorage from '@react-native-community/async-storage';
import {onUnlinkUpdate} from '../services/commonService';

const PostRequestApi = async (url, params) => {
  return await axios
    .post('https://admin.moodflo.com/api/' + url, params)
    .then((resp) => {
      return resp;
    });
};

export async function GetStaffUserData(params, dispatch) {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify(params);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return await fetch(
    'https://admin.moodflo.com/api/getStaffUserData',
    requestOptions,
  )
    .then((response) => response.json())
    .then(async (result) => {
      console.log(
        '✅ ✅ ✅ ✅ Success Get Staff User Data ✅ ✅ ✅ ✅',
        result?.userData,
      );
      if (result?.userData?.status === 2) {
        onUnlinkUpdate(dispatch);
      }
      return result;
    })
    .catch((error) =>
      console.log('❌ ❌ ❌ ❌ Error Get Staff User Data ❌ ❌ ❌ ❌', error),
    );
}

export async function getDivisionName(params, dispatch, isUnlinkAllowed) {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify(params);

  GetStaffUserData(params, dispatch)
    .then(async (result) => {
      // return new Promise((resolve, reject) => {
      if (result?.userData?.status !== 2) {
        axios
          .post('https://admin.moodflo.com/api/getAllDivision', params)
          .then((res) => {
            let divisionName = '';
            if (Array.isArray(res?.data?.data)) {
              const divisions = res.data.data.filter(e => {
                if ((e?.total_staff ?? -1) === -1) {
                  return true;
                } else if (e.total_staff > (e?.onboard_staff ?? 0)) {
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
                  AsyncStorage.setItem('Division', divisionName)
                    .then((r) => {
                      // console.log('AsyncStorate set division success', r);
                    })
                    .catch((e) =>
                      console.log('AsyncStorage set division error', e),
                    );
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
            // console.log('divisionName: ', divisionName);
            // resolve(divisionName ? divisionName : false);
          })
          .catch((e) => {
            // resolve(false);
            console.log('error getting diviision', e);
          });
      } else {
        // resolve(false);
      }
      // });
    })
    .catch((error) =>
      console.log('❌ ❌ ❌ ❌ Error Get Staff User Data ❌ ❌ ❌ ❌', error),
    );
}

export default PostRequestApi;
