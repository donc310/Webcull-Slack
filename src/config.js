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
  addLink: 'bookmarks/index/acc',
  listStacks: 'bookmarks/index/acc',
};
module.exports = {
  endPoints: webcullEndpoints,
  scopes: slackScopes,
  appHome: 'https://app-webcull.herokuapp.com',
};
