const { loadToken, addToken } = require('../api/webcull');

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
 * @param {*} installation
 * @param {*} installOptions
 */
async function storeTeamInfo(installation) {
  const storeReq = {
    botToken: installation.bot.token,
    botId: installation.bot.id,
    botUserId: installation.bot.userId,
  };
  const { data } = await loadToken(installation.team.id);
  if (data.success === 'true') {
    return true;
  }
  const storeResponse = await addToken(
    installation.team.id,
    JSON.stringify(storeReq)
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
    JSON.stringify(storeReq)
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
module.exports = {
  authorizer,
  fetchInstallationInfo,
  storeUserInfo,
  storeTeamInfo,
  generateKey,
};
