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
      }
      return result;
    })
    .catch((error) =>
      console.log('❌ ❌ ❌ ❌ Error Get Staff User Data ❌ ❌ ❌ ❌', error),
    );
}

export async function getDivisionName(params, dispatch) {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify(params);

  GetStaffUserData(params, dispatch)
    .then(async (result) => {
      // return new Promise((resolve, reject) => {
      if (result?.userData?.status !== 2) {
        axios
          .post('https://admin.moodflo.com/api/getDivision', params)
          .then((res) => {
            let divisionName = '';
            if (Array.isArray(res?.data?.data)) {
              dispatch(getDivisions(res.data.data));
              // console.log('getDivisions success dispatch getDivision');
              if (result?.userData?.division_id) {
                res.data.data.forEach((e) => {
                  if (!divisionName) {
                    divisionName =
                      e.id === result.userData.division_id ? e?.name ?? '' : '';
                  }
                });
                if (typeof divisionName === 'string') {
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
