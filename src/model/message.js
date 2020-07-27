const messages = {};
messages['HELP'] = {
  text:
    ':wave: Hi @ <@U016WNBD4BY>, Welcome to the WebCull app on Slack. You can quickly create or manage your bookmarks.\n These are the available commands:',
  attachments: [
    {
      color: '#2196f3',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text:
              '`/webcull add [url|stack]` creates a new bookmark \n' +
              '`/webcull list ` returns a list of bookmarks',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '`/webcull help ` shows this help command. \n',
          },
        },
      ],
    },
  ],
};
messages['ADD'] = {
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          'You have a new request:\n*<google.com|Fred Enriquez - Time Off request>*',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          '*Type:*\nPaid time off\n*When:*\nAug 10-Aug 13\n*Hours:* 16.0 (2 days)\n*Remaining balance:* 32.0 hours (4 days)\n*Comments:* "Family in town, going camping!"',
      },
      accessory: {
        type: 'image',
        image_url:
          'https://api.slack.com/img/blocks/bkb_template_images/approvalsNewDevice.png',
        alt_text: 'computer thumbnail',
      },
    },
  ],
};
function composeHelpMsg(context) {
  const message = {
    text: `:wave: Hi @ <@${context.user.slackUser}>, Welcome to the WebCull app on Slack. You can quickly create or manage your bookmarks.\n These are the available commands:`,
    attachments: [
      {
        color: '#2196f3',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text:
                '`/webcull add [url|stack]` creates a new bookmark \n' +
                '`/webcull list ` returns a list of bookmarks',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '`/webcull help ` shows this help command. \n',
            },
          },
        ],
      },
    ],
  };
  return message;
}
function composeBookmarkAddMsg(context, bookmark) {
  const message = {
    attachments: [
      {
        color: '#2196f3',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text:
                bookmark.is_url === 1
                  ? `<@${context.user.slackUser}> ,New bookmark:\n*<${bookmark.value}|${bookmark.value} - ${bookmark.nickname}>*`
                  : `<@${context.user.slackUser}> ,New stack:\n *${bookmark.nickname}*`,
            },
          },
        ],
      },
    ],
  };
  return message;
}
module.exports = {
  help: composeHelpMsg,
  add: composeBookmarkAddMsg,
  messages,
};
