const { loadToken, addToken } = require('../api/webcull');
const tokenizer = require('string-tokenizer');
const createUrlRegex = require('url-regex');
/**
 *
 * @param {*} param0
 */
async function authorizer({ userId, teamId, enterpriseId }) {
  const token = await fetchInstallationInfo(teamId);
  if (token) {
    return token;
  }
  throw new Error('No matching authorizations');
}

/**
 *
 * @param {*} installationL
 */
async function storeTeamInfo(installation) {
  const storeReq = {
    botToken: installation.bot.token,
    botId: installation.bot.id,
    botUserId: installation.bot.userId,
  };
  const storeResponse = await addToken(
    installation.team.id,
    JSON.stringify(storeReq),
  );
  if (storeResponse.data.success === 'true') {
    return true;
  }
  throw new Error('Failure to store installation information');
}

/**
 *
 * @param {*} installation
 * @param {*} installOptions
 */
async function storeUserInfo(installation, installOptions) {
  const storeReq = {
    botToken: installation.bot.token,
    botId: installation.bot.id,
    botUserId: installation.bot.userId,
    webcullAuth: JSON.parse(installOptions.metadata),
  };
  const response = await addToken(
    installation.user.id,
    JSON.stringify(storeReq),
  );
  if (response.data.success === 'true') {
    return true;
  }
  throw new Error('Failure to store installation information');
}
/**
 *
 * @param {*} key
 */
async function fetchInstallationInfo(key) {
  const { data } = await loadToken(key);
  if (data.success === 'true') {
    return JSON.parse(data.token);
  }
  return null;
}
/**
 *
 * @param  {...any} keys String
 */
function generateKey(...keys) {
  return keys.join('_');
}
function arrayOrUndefined(data) {
  if (typeof data === 'undefined' || Array.isArray(data)) {
    return data;
  }
  return [data];
}
function parseUrl(text) {
  const tokens = tokenizer()
    .input(text)
    .token('url', createUrlRegex())
    .resolve();
  return arrayOrUndefined(tokens.url);
}
module.exports = {
  authorizer,
  fetchInstallationInfo,
  storeUserInfo,
  storeTeamInfo,
  generateKey,
  arrayOrUndefined,
  parseUrl,
};
