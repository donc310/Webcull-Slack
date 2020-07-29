/**
 *
 * @param {*} context
 */
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
/**
 *
 * @param {*} context
 * @param {*} bookmark
 */
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
/**
 *
 * @param {Object} context
 * @param {Array} stackList
 */
function composeListMsg(context, stackList) {
  const message = {
    attachments: [],
  };
  message.attachments = stackList
    .filter((entry) => entry.is_url === '1')
    .map((entry) => {
      return {
        color: '#2196f3',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*<${entry.value}|${entry.value}>*`,
            },
          },
        ],
      };
    });
  return message;
}
module.exports = {
  help: composeHelpMsg,
  add: composeBookmarkAddMsg,
  list: composeListMsg,
};
