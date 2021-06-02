import React from 'react';
import axios from 'axios';
import { GetUserId, IsAnonymous, UserDetail, UserDivision, UserEmail } from '../redux/actions/actions';
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
    
    return  await fetch('https://admin.moodflo.com/api/getStaffUserData', requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        console.log(
          '✅ ✅ ✅ ✅ Success Get Staff User Data ✅ ✅ ✅ ✅',
          result?.userData
        );
        if(result?.userData?.status === 2) {
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
      .catch((error) => console.log('❌ ❌ ❌ ❌ Error Get Staff User Data ❌ ❌ ❌ ❌', error));
};

export default PostRequestApi;
