const qs = require('qs');
const request = require('./requests').request;
const config = require('../config');

const Reqconfig = {
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'Accept-Encoding': 'gzip',
  },
};
/**
 *
 * @param {*} email
 * @param {*} password
 */
async function authenticate(email, password) {
  return request.post(
    config.endPoints.authenticate,
    qs.stringify({
      email: email,
      proc: 'login',
      pass: password,
      stayLoggedIn: 1,
    }),
    Reqconfig,
  );
}
/**
 *
 * @param {*} key
 */
async function loadToken(key) {
  return request.post(
    config.endPoints.loadToken,
    qs.stringify({
      service: process.env.WEB_CULL_SERVICE_KEY,
      pass: process.env.WEB_CULL_SERVICE_PASS,
      key: key,
    }),
    Reqconfig,
  );
}
async function deleteToken() {
  return request();
}
/**
 *
 * @param {*} key
 * @param {*} value
 */
async function addToken(key, value) {
  return request.post(
    config.endPoints.savetoken,
    qs.stringify({
      service: process.env.WEB_CULL_SERVICE_KEY,
      pass: process.env.WEB_CULL_SERVICE_PASS,
      key: key,
      value: value,
    }),
    Reqconfig,
  );
}
/**
 *
 * @param {Object} args
 */
async function addLinkOrStack(args) {
  return request.post(
    config.endPoints.addLink + `/${args.key}/`,
    qs.stringify({
      token: args.token,
      value: args.value,
      proc: 'new',
      parent_id: 0,
    }),
    Reqconfig,
  );
}
/**
 *
 * @param {*} args
 */
async function listBookmarksStacks(args) {
  return request.post(
    config.endPoints.listStacks + `/${args.key}/`,
    qs.stringify({
      token: args.token,
      proc: 'load',
    }),
    Reqconfig,
  );
}
module.exports = {
  addToken,
  deleteToken,
  loadToken,
  authenticate,
  addLinkOrStack,
  listBookmarksStacks,
};
