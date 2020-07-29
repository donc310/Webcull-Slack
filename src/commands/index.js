const helpCommand = require('./help');
const addCommand = require('./add');
const listCommand = require('./list');
const commands = [helpCommand, addCommand, listCommand];

/**
 *
 * @param {String} command
 */
function getCommandHandler(command) {
  const cmd = command.split(' ').length ? command.split(' ')[0] : null;
  if (!cmd) {
    return null;
  }
  const handler = commands.find((command) => {
    return cmd.match(command.pattern);
  });
  if (handler) {
    return handler;
  }
  return null;
}
module.exports = {
  getCommandHandler,
};
