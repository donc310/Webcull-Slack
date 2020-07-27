require('dotenv-flow').config();
const { App } = require('@slack/bolt');
const { receiver } = require('./receiver');
const { authorizer, parseUrl } = require('./utils');
const {
  middleWares,
  noBotMessages,
  commandParser,
  directMention,
} = require('./middleware');
const { views } = require('./model/views');
const { getCommandHandler } = require('./commands');
const { help } = require('./model/message');
const helpCommand = require('./commands/help');

const app = new App({
  receiver,
  authorize: authorizer,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
});

middleWares.forEach((middleWare) => {
  app.use(middleWare);
});

app.command(
  '/webcull',
  commandParser,
  async ({ command, context, ack, respond }) => {
    try {
      await ack();
      const msg = command.text.trim();
      if (!msg) {
        return helpCommand.handler(command, context, respond);
      }
      const cmdHandler = getCommandHandler(msg);
      if (cmdHandler) {
        return cmdHandler.handler(command, context, respond);
      } else {
        const defaultHandler = getCommandHandler('add');
        return defaultHandler.handler(command, context, respond);
      }
    } catch (error) {
      console.log(error);
    }
  },
);
app.message(noBotMessages, directMention, async ({ message, context }) => {
  try {
    const msg = message.processedText;
    const cmdHandler = getCommandHandler(msg);
    if (!msg || (cmdHandler && cmdHandler.name === 'help')) {
      await app.client.chat.postEphemeral({
        token: context.botToken,
        channel: message.channel,
        user: message.user,
        text: `Hey there <@${message.user}>!`,
        attachments: help(context).attachments,
      });
      return;
    }
    const defaultHandler = getCommandHandler('add');
    context.parsedUrl = parseUrl(msg);
    defaultHandler.handler({ text: msg }, context, async function (res) {
      const defaults = {
        token: context.botToken,
        channel: message.channel,
        user: message.user,
      };
      const response = Object.assign(defaults, res);
      await app.client.chat.postEphemeral(response);
    });
  } catch (error) {
    console.log(error);
  }
});
app.action('button_click', async ({ body, ack, say }) => {
  await ack();
  await say(`<@${body.user.id}> clicked the button`);
});
app.event('app_home_opened', async ({ event, context }) => {
  if (!event.tab === 'home') {
    return;
  }
  try {
    await app.client.views.publish({
      token: context.botToken,
      user_id: event.user,
      view: views.HOME,
    });
  } catch (error) {
    console.error(error);
  }
});
app.event('app_uninstalled', async ({ event, context }) => {
  try {
    console.log('app_uninstalled');
  } catch (error) {
    console.error(error);
  }
});

app.error((error) => {
  console.error(error);
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
