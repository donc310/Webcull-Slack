const { listBookmarksStacks } = require('../api/webcull');
const { list } = require('../model/message');
const pattern = /list/gi;

async function listHandler(command, context, respond) {
  try {
    const args = {
      key: context.user.hash,
      token: context.user.token,
    };
    const { data } = await listBookmarksStacks(args);
    const STACKS_ = [];

    for (let stackParent in data.stack) {
      for (let stackChild in data.stack[stackParent]) {
        const stack = data.stack[stackParent][stackChild];
        stack.forEach((entry) => {
          STACKS_.push({
            value: entry.value,
            nickname: entry.nickname,
            stack_id: entry.stack_id,
            parent_id: entry.parent_id,
            is_url: entry.is_url,
          });
        });
      }
    }
    const msg = list(context, STACKS_);
    respond(msg);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { name: 'list', pattern: pattern, handler: listHandler };
