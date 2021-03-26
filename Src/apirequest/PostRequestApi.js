import axios from 'axios';
import React from 'react';

const PostRequestApi = async (url, params) => {
  return await axios
    .post('https://admin.moodflo.com/api/' + url, params)
    .then((resp) => {
      return resp;
    });
};

export default PostRequestApi;
