// Description:
//   Generates help commands for Hubot.
//
// Commands:
//   hubot devs created <days> - apigee - Search all developers with accounts created within the last <days>.  If <days> is omitted, it is assumed to be from the last 24 hours.

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
const { firstBy } = require('thenby')

const differenceInCalendarDays = require('date-fns/difference_in_calendar_days')
const formatDateTime = require('date-fns/format')

const { getDeveloper } = require('../endpoints/apigeeActions')


module.exports = robot => {
  const slack = new slackClient(robot.adapter.options.token)

  /*
  examples:
  "devs created <number of days>" (shows all.developers whose accounts were created in the last X number of days)
  "devs created" (shows all developers whose accounts were created in the last 24 hours)
  */
  robot.respond(/devs created(?: ([0-9]+))?/i, async res => {
    const [, days = 1] = res.match

    try {
      const allDevelopers = await getDeveloper()

      const filteredDevelopers = allDevelopers.developer
        .filter(
          dev => differenceInCalendarDays(new Date(), dev.createdAt) <= days
        )
        .map(dev => ({
          developer: dev.email,
          created: formatDateTime(dev.createdAt, 'MM/DD/YYYY h:mm:ss A')
        }))

      filteredDevelopers.sort(firstBy('developer'))

      await slack.files.upload({
        channels: res.message.room, //this makes it public, otherwise it wont output
        content:
          cTable.getTable(filteredDevelopers).trim() ||
          'nothing matches your criteria',
        title: `showing developers with accounts created within the last ${days} days`
      })
    } catch (err) {
      console.log('err', err)
      res.reply(
        'uh oh, something bad happened.  Try your message again.  If error persists, call for help.'
      )
    }
  })
}
