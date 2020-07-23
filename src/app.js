require('dotenv-flow').config();
const { App } = require('@slack/bolt');
const { receiver } = require('./receiver');
const { authorizer } = require('./utils');
const { middleWares, noBotMessages, commandParser } = require('./middleware');
const { messages } = require('./model/message');
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
      console.log(context);
      await respond(`${command.command}`);
    } catch (error) {
      console.log(error);
    }
  },
);
app.message(noBotMessages, async ({ message, say, context }) => {
  await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hey there <@${message.user}>!`,
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Click Me',
          },
          action_id: 'button_click',
        },
      },
    ],
    text: `Hey there <@${message.user}>!`,
  });
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
      view: messages.HOME,
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
