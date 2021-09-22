import axios from 'axios';
import React from 'react';
import {getApiBaseUrl} from '../Constants/constants';

const GetRequestApi = async (url, params) => {
  return await axios.get(`${getApiBaseUrl()}getDivision`).then((resp) => {
    return resp;
  });
};

export default GetRequestApi;
