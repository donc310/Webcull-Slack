const { fetchInstallationInfo } = require('../utils');
const tokenizer = require('string-tokenizer');
const createUrlRegex = require('url-regex');

async function authWebcull({ payload, context, next, client }) {
  if (payload.type && payload.type === 'button') {
    await next();
    return;
  }
  let webcullUser, slackUser, token, channel;
  try {
    slackUser = payload.command ? payload.user_id : payload.user;
    token = payload.command ? payload.token : context ? context.botToken : null;
    channel = payload.command
      ? payload.channel_id
      : context
      ? context.channel
      : null;
    webcullUser = await fetchInstallationInfo(slackUser);
    if (!webcullUser) {
      token &&
        channel &&
        (await client.chat.postEphemeral({
          token: token,
          channel: channel,
          user: slackUser,
          text: `Sorry <@${slackUser}>, couldn't authenticate you with webCull`,
        }));
      return;
    }
    context.user = webcullUser.webcullAuth;
  } catch (error) {
    token &&
      channel &&
      (await client.chat.postEphemeral({
        token: token,
        channel: channel,
        user: slackUser,
        text: `Sorry <@${slackUser}>, couldn't authenticate you with webCull`,
      }));
    throw error;
  }
  await next();
}
// eslint-disable-next-line no-unused-vars
function logger(args) {
  const copiedArgs = JSON.parse(JSON.stringify(args));
  copiedArgs.context.botToken = 'xoxb-***';
  if (copiedArgs.context.userToken) {
    copiedArgs.context.userToken = 'xoxp-***';
  }
  copiedArgs.client = {};
  copiedArgs.logger = {};
  args.logger.info(
    'Dumping request data for debugging...\n\n' +
      JSON.stringify(copiedArgs, null, 2) +
      '\n',
  );
  args.next();
}
async function noBotMessages({ message, next }) {
  if (!message.subtype || message.subtype !== 'bot_message') {
    await next();
  }
}

function arrayOrUndefined(data) {
  if (typeof data === 'undefined' || Array.isArray(data)) {
    return data;
  }
  return [data];
}

function commandParser({ command, context, next }) {
  const tokens = tokenizer()
    .input(command.text)
    .token('url', createUrlRegex())
    .resolve();
  context.parsedUrl = arrayOrUndefined(tokens.url);
  next();
}
module.exports = {
  middleWares: [authWebcull],
  noBotMessages,
  commandParser,
};
