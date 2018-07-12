// Description:
//   Generates help commands for Hubot.
//
// Commands:
//   hubot devapps (all|no|approved|pending|revoked) - Display developer applications by status or by its api product status
//   hubot devapps search <text> - Search all developer applications that contains <text>
//   hubot devapps (approve|revoke) <developer> <developerApp> - Approve or revoke a developer app
//   hubot devapps (approve|revoke) <developer> <developerApp> <apiProduct> - Approve of revoke an apiProduct within a developer app

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
const { firstBy } = require('thenby')

const { postDeveloperApp } = require('../endpoints/apigeeActions')
const listenToDevapps = /devapps (all|no|approved|pending|revoked)/i
const searchDevApps = /devapps search (.*)/i

const modifyDevAppStatus = /devapps (approve|revoke) (\S+) (\S+)(?: (\S+))?/i

module.exports = robot => {
  const slack = new slackClient(robot.adapter.options.token)

  robot.respond(modifyDevAppStatus, async res => {
    const [, action, developer, app, apiProduct] = res.match

    //TODO: we need to apply status if someone inputs an apiProduct
    try {
      await postDeveloperApp(developer, app, action)

      const data = await apiProducts().then(allProducts =>
        allProducts.filter(
          apiProduct =>
            apiProduct.developer == developer && apiProduct.developerApp == app
        )
      )

      data.sort(
        firstBy('developer')
          .thenBy('developerApp')
          .thenBy('apiProduct')
          .thenBy('apiStatus')
      )

      await slack.files.upload({
        channels: res.message.room, //this makes it public, otherwise it wont output
        content: cTable.getTable(data).trim(),
        title: `updating ${developer} ${app} to status ${action}`
      })
    } catch (err) {
      console.log('err', err)
      res.reply(
        'uh oh, something bad happened.  Try your message again.  If error persists, call for help.'
      )
    }
  })

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

      data.sort(
        firstBy('developer')
          .thenBy('developerApp')
          .thenBy('apiProduct')
          .thenBy('apiStatus')
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

      data.sort(
        firstBy('developer')
          .thenBy('developerApp')
          .thenBy('apiProduct')
          .thenBy('apiStatus')
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
