const { help } = require('../model/message');
function helpHandler(command, context, respond) {
  respond(help(context));
}
module.exports = { name: 'help', pattern: /help/gi, handler: helpHandler };
