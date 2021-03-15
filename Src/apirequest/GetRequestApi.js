import axios from 'axios';
import React from 'react';

const GetRequestApi = async (url, params) => {
  return await axios
    .get('http://admin.moodflo.com/api/getDivision')
    .then((resp) => {
      return resp;
    });
};

export default GetRequestApi;
