const axios = require('axios').default;
const service = axios.create({
  baseURL: process.env.WEB_CULL_BASE_URL,
  timeout: 10000,
});
module.exports.request = service;
