const { add } = require('../model/message');
const { addLinkOrStack } = require('../api/webcull');
const pattern = /add/gi;

async function addHandler(command, context, respond) {
  const args = {
    key: context.user.hash,
    token: context.user.token,
  };
  if (context.parsedUrl) {
    context.parsedUrl.forEach(async (link) => {
      try {
        var { data } = await addLinkOrStack(
          Object.assign({ value: link }, args),
        );
        respond(add(context, data));
      } catch (error) {
        console.log(error);
      }
    });
    return;
  }
  try {
    var { data } = await addLinkOrStack(
      Object.assign(
        { value: command.text.substr(command.text.indexOf(' ') + 1) },
        args,
      ),
    );
    respond(add(context, data));
  } catch (error) {
    console.log(error);
  }
}
module.exports = { name: 'add', pattern: pattern, handler: addHandler };
