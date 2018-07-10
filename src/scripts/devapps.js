// Description:
//   Generates help commands for Hubot.
//
// Commands:
//   hubot devapps (all|no|approved|pending|revoked) - Display developer applications by status or by its api product status
//   hubot devapps search <text> - Search all developer applications that contains <text>
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

const { WebClient: slackClient } = require('@slack/client')
const cTable = require('console.table')
const { apiProducts } = require('../utils/misc')


const listenToDevapps = /devapps (all|no|approved|pending|revoked)/i
const searchDevApps = /devapps search (.*)/i


module.exports = robot => {
  const slack = new slackClient(robot.adapter.options.token)

  robot.respond(searchDevApps, async res => {
    const searchText = res.match[1]
    try {
      const data = await apiProducts().then(allProducts =>
        allProducts.filter(
          apiProduct =>
            apiProduct.developer.includes(searchText) ||
            apiProduct.developerApp.includes(searchText) ||
            apiProduct.apiProduct.includes(searchText)
        )
      )

      await slack.files.upload({
        channels: res.message.room, //this makes it public, otherwise it wont output
        content: cTable.getTable(data).trim(),
        title: `searching for ${searchText}`
      })
    } catch (err) {
      res.reply(
        'uh oh, something bad happened.  Try your message again.  If error persists, call for help.'
      )
    }
  })

  robot.respond(listenToDevapps, async res => {
    const status = res.match[1]

    try {
      const data = await apiProducts().then(allProducts =>
        allProducts.filter(apiProduct => {
          if (status === 'all') {
            return true
          }
          if (status === 'no') {
            return apiProduct.apiStatus === '---'
          }
          if (status === 'revoked') {
            return (
              apiProduct.appStatus === status || apiProduct.apiStatus === status
            )
          }
          if (status === 'approved' || status === 'pending') {
            return apiProduct.apiStatus === status
          }
        })
      )

      await slack.files.upload({
        channels: res.message.room, //this makes it public, otherwise it wont output
        content: cTable.getTable(data).trim(),
        title: status
      })
    } catch (err) {
      res.reply(
        'uh oh, something bad happened.  Try your message again.  If error persists, call for help.'
      )
    }
  })
}
