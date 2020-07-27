const { fetchInstallationInfo } = require('../utils');
const { parseUrl } = require('../utils');

/**
 *
 * @param {*} param0
 */
async function authWebcull({ payload, context, next, client }) {
  let webcullUser, slackUser, token, channel;
  try {
    slackUser = payload.command ? payload.user_id : payload.user;
    token = payload.command ? payload.token : context ? context.botToken : null;
    channel = payload.command
      ? payload.channel_id
      : context
      ? context.channel
      : null;
    if (payload.type && payload.type === 'button') {
      context.user = {};
      (context.user.slackUser = slackUser), await next();
      return;
    }
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
  context.user = webcullUser.webcullAuth;
  context.user.slackUser = slackUser;
  await next();
}
/**
 *
 * @param {*} args
 */

function logger(args) {
  if (process.env.SLACK_DEBUG_MODE === '0') {
    args.next();
    return;
  }
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
/**
 *
 * @param {*} param0
 */
async function noBotMessages({ message, next }) {
  if (!message.subtype || message.subtype !== 'bot_message') {
    await next();
  }
}
const slackLink = /<(?<type>[@#!])?(?<link>[^>|]+)(?:\|(?<label>[^>]+))?>/;
async function directMention({ message, context, next }) {
  if (context.botUserId === undefined) {
    throw new Error(
      'Cannot match direct mentions of the app without a bot user ID. Ensure authorize callback returns a botUserId.',
    );
  }
  if (message.text === undefined) {
    return;
  }
  const text = message.text.trim();
  const matches = slackLink.exec(text);
  if (
    matches === null ||
    matches.index !== 0 ||
    matches.groups === undefined ||
    matches.groups.type !== '@' ||
    matches.groups.link !== context.botUserId
  ) {
    return;
  }
  message.processedText = text.replace(slackLink, '').trim();
  await next();
}

/**
 *
 * @param {*} param0
 */
async function commandParser({ command, context, next }) {
  const tokens = parseUrl(command.text);
  context.parsedUrl = tokens;
  await next();
}
module.exports = {
  middleWares: [authWebcull, logger],
  noBotMessages,
  commandParser,
  directMention,
};
