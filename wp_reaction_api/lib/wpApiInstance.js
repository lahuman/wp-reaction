'use strict'

const fetch = require('node-fetch');

const TOKEN = `&access_token=${process.env.ANALYTICS_ACCESS_KEY}`;

const wpApi = async ({url}) => {
  let apiUrl = url;
  if(url.indexOf('?') === -1){
    apiUrl += '?' + TOKEN;
  }else{
    apiUrl += TOKEN;
  }
  const res = await fetch(`${process.env.WP_API_HOST}${apiUrl}`);
  const response = await res.json();
  return response;
}

module.exports = wpApi;