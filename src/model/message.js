const messages = {};
messages['HOME'] = {
  type: 'home',
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          "Hey there 👋 I'm TaskBot. I'm here to help you create and manage tasks in Slack.\nThere are two ways to quickly create tasks:",
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          "*1️⃣ Use the `/task` command*. Type `/task` followed by a short description of your tasks and I'll ask for a due date (if applicable). Try it out by using the `/task` command in this channel.",
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text:
            '👀 View all tasks with `/task list`\n❓Get help at any time with `/task help` or type *help* in a DM with me',
        },
      ],
    },
  ],
};

module.exports = { messages };
