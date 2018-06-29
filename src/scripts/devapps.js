// Description:
//   Generates help commands for Hubot.
//
// Commands:
//   hubot devapps (approved|revoked) apiproducts - Display api products by status
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

const { WebClient } = require('@slack/client')
const { formatMarkDown } = require('../utils')
const { apiProducts } = require('../utils/misc')

const listenToDevapps = /devapps (no|approved|pending|revoked) apiproducts/i

module.exports = robot => {
  const slack = new WebClient(robot.adapter.options.token)

  robot.respond(listenToDevapps, async res => {
    const status = res.match[1]

    try {
      const data = await apiProducts(status)

      res.send(formatMarkDown(data))

      //TODO: we should use slack api instead, but they're changing the API in June 2018 so it's not working really well
      // await slack.files.upload({
      //   channel: res.message.room, //this makes it public
      //   content: 'this is a snippet content',
      //   // content: `\`\`\`\n${slackFormatCodeBlock(data)}\n\`\`\``,
      //   // title: status
      // })
    } catch (err) {
      res.reply(
        'uh oh, something bad happened.  Try your message again.  If error persists, call for help.'
      )
    }
  })
}
