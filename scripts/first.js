// Description:
//   Generates help commands for Hubot.
//
// Commands:
//   hubot help - Displays all of the help commands that this bot knows about.
//   hubot help <query> - Displays all help commands that match <query>.
//
// URLS:
//   /hubot/help
//
// Configuration:
//   HUBOT_HELP_REPLY_IN_PRIVATE - if set to any value, all `hubot help` replies are sent in private
//   HUBOT_HELP_DISABLE_HTTP - if set, no web entry point will be declared
//   HUBOT_HELP_HIDDEN_COMMANDS - comma-separated list of commands that will not be displayed in help
//
// Notes:
//   These commands are grabbed from comment blocks at the top of each file.

const listenTo = /q/i

module.exports = robot => {
  robot.respond(listenTo, res => {
    // console.log('robot', robot.brain.userForName(res.message.user.name))
    console.log('auth', robot.auth)

    console.log('res', res.message.user)

    return res.reply('hello back Kevinnnn')
  })

  robot.respond(/ww/i, res => {
    return res.reply('qwerty keyboard')
  })
}
