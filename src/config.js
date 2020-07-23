const slackScopes = [
  'channels:history',
  'chat:write',
  'commands',
  'groups:history',
  'im:history',
  'mpim:history',
  'channels:join',
];
const webcullEndpoints = {
  login: 'accounts',
  deleteToken: 'api/deletetoken',
  savetoken: 'api/savetoken',
  loadToken: 'api/loadtoken',
  authenticate: 'accounts',
};
module.exports = {
  endPoints: webcullEndpoints,
  scopes: slackScopes,
  appHome: 'https://e65180f0f6f6.ngrok.io',
};
