// Description:
//   Generates help commands for Hubot.
//
// Commands:
//   hubot apps (all|no|approved|pending|revoked) - apigee - Display developer applications by status or by its api product status
//   hubot apps search <text> - apigee - Search all developer applications that contains <text>
//   hubot apps (approve|revoke) <developerEmail> <developerApp> - apigee - Approve or revoke a developer app and all of the api products associated with that developer app
//   hubot apps (approve|revoke) <developerEmail> <developerApp> <apiProduct> - apigee - Approve or revoke an apiProduct within a developer app.  Does not apply status change to main developer app.

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

const {
  postDeveloperApp,
  postDeveloperAppProduct,
  getDeveloperApps
} = require('../endpoints/apigeeActions')

module.exports = robot => {
  const slack = new slackClient(robot.adapter.options.token)

  /*
  examples:
  "apps approve kevin.wu@gmail.com kevinwu-double-mixed" (approve the developer app of kevin.wu@gmail.com/kevinwu-double-mixed and all of the api products associated with this developer app)
  "apps approve kevin.wu@gmail.com kevinwu-double-mixed student-lookups" (approve just the student-lookup api product of the developer app kevin.wu@gmail.com/kevinwu-double-mixed)
  */
  robot.respond(/apps (approve|revoke) (\S+) (\S+)(?: (\S+))?/i, async res => {
    const [, status, developer, app, apiProduct] = res.match

    try {
      const { credentials } = await getDeveloperApps(developer, app)
      const { consumerKey, apiProducts: products = [] } = credentials[0]

      if (!apiProduct) {
        //if no apiProducts were defined, then also set the app status
        await postDeveloperApp(developer, app, status)
      }

      await products
        .filter(
          product =>
            apiProduct
              ? product.apiproduct === apiProduct
              : !product.status.includes(status)
        )
        //TODO: I could only get serial calls to work.  Maybe someone can get parallel executions to work?  This might be an Apigee-specific nuance
        .reduce(
          (promise, product) =>
            promise.then(() =>
              postDeveloperAppProduct(
                developer,
                app,
                product.apiproduct,
                consumerKey,
                status
              )
            ),
          Promise.resolve()
        )

      const data = await apiProducts().then(allProducts =>
        allProducts.filter(
          product =>
            product.developer == developer && product.developerApp == app
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
        title: `updating ${developer} ${app} to status ${status}`
      })
    } catch (err) {
      console.log('err', err)
      res.reply(
        'uh oh, something bad happened.  Try your message again.  If error persists, call for help.'
      )
    }
  })

  /*
  examples:
  "apps search kevinwu" (shows all developer alls where it can find on a search term of 'kevinwu' in the developer, developerApp, or apiProduct)
  */
  robot.respond(/apps search (.*)/i, async res => {
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
      console.log(err)
      res.reply(
        'uh oh, something bad happened.  Try your message again.  If error persists, call for help.'
      )
    }
  })

  /*
  examples:
  "apps all" (shows all developer apps and their api products)
  "apps no" (shows developer apps with no api products)
  "apps approved" (shows developer apps that are approved)
  */
  robot.respond(/apps (all|no|approved|pending|revoked)/i, async res => {
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
