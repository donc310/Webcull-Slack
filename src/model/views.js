const views = {};
views['HOME'] = {
  type: 'home',
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Hey there 👋',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          ' Use the `/webcull` command to manage your webcull bookmarks.\n' +
          ' Type `/webcull add [url|stack]` or `@webcull [url|stack]` to create a bookmark|stack. \n' +
          ' Try it out by using the `/webcull` command in this channel.',
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
            '👀 View all bookmarks/stacks with `/webcull list`\n' +
            '❓Get help at any time with `/webcull help` or type `@webcull help` in a DM with me',
        },
      ],
    },
  ],
};

module.exports = { views };
