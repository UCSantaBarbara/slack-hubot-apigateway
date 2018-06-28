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

const { apiProducts } = require('../goforit')

const listenTo = /q/i

const sample = [
  {
    email: 'collaborate-gauchospace.dev@ucsb.edu',
    developerApplication: 'ondas-check-in-dev',
    status: 'approved',
    apiproduct: 'students-registrations'
  },
  {
    email: 'collaborate-gauchospace.dev@ucsb.edu',
    developerApplication: 'ondas-check-in-dev',
    status: 'approved',
    apiproduct: 'students-lookups'
  },
  {
    email: 'datahelp@arit.ucsb.edu',
    developerApplication: 'mtd-active-badges',
    status: 'approved',
    apiproduct: 'students-private-mtdaccess'
  },
  {
    email: 'collaborate-gauchospace.dev@ucsb.edu',
    developerApplication: 'gauchospace',
    status: 'approved',
    apiproduct: 'students-private-deptcourses'
  },
  {
    email: 'yaheya@ucsb.edu',
    developerApplication: 'yaheya-app',
    status: 'approved',
    apiproduct: 'ucpath-employeemap'
  },
  {
    email: 'steven.maglio.sa@gmail.com',
    developerApplication: 'app-smaglio-dev',
    status: 'approved',
    apiproduct: 'students-lookups'
  },
  {
    email: 'steven.maglio.sa@gmail.com',
    developerApplication: 'app-smaglio-dev',
    status: 'approved',
    apiproduct: 'ucpath-employeemap'
  },
  {
    email: 'diana.antova@sa.ucsb.edu',
    developerApplication: 'diana-test',
    status: 'approved',
    apiproduct: 'students-lookups'
  },
  {
    email: 'diana.antova@sa.ucsb.edu',
    developerApplication: 'diana-test',
    status: 'approved',
    apiproduct: 'ucpath-employeemap'
  },
  {
    email: 'dpgurb@ucsb.edu',
    developerApplication: 'id-esci-webextract-processing-tool',
    status: 'approved',
    apiproduct: 'students-lookups'
  },
  {
    email: 'dpgurb@ucsb.edu',
    developerApplication: 'id-esci-webextract-processing-tool',
    status: 'approved',
    apiproduct: 'ucpath-employeemap'
  },
  {
    email: 'itops-admins@library.ucsb.edu',
    developerApplication: 'ares',
    status: 'approved',
    apiproduct: 'students-private-deptcourses'
  },
  {
    email: 'itops-admins@library.ucsb.edu',
    developerApplication: 'ares',
    status: 'approved',
    apiproduct: 'students-lookups'
  },
  {
    email: 'itops-admins@library.ucsb.edu',
    developerApplication: 'ares',
    status: 'approved',
    apiproduct: 'academics-quartercalendar'
  },
  {
    email: 'steven.maglio@sa.ucsb.edu',
    developerApplication: 'app-smaglio',
    status: 'approved',
    apiproduct: 'students-registrations'
  },
  {
    email: 'steven.maglio@sa.ucsb.edu',
    developerApplication: 'app-smaglio',
    status: 'approved',
    apiproduct: 'students-private-deptcourses'
  },
  {
    email: 'steven.maglio@sa.ucsb.edu',
    developerApplication: 'app-smaglio',
    status: 'approved',
    apiproduct: 'students-lookups'
  },
  {
    email: 'steven.maglio@sa.ucsb.edu',
    developerApplication: 'app-smaglio',
    status: 'approved',
    apiproduct: 'administration-financial-accounts-chartfield'
  },
  {
    email: 'steven.maglio@sa.ucsb.edu',
    developerApplication: 'app-smaglio',
    status: 'approved',
    apiproduct: 'students-private-mtdaccess'
  },
  {
    email: 'steven.maglio@sa.ucsb.edu',
    developerApplication: 'app-smaglio',
    status: 'approved',
    apiproduct: 'academics-quartercalendar'
  },
  {
    email: 'steven.maglio@sa.ucsb.edu',
    developerApplication: 'app-smaglio',
    status: 'approved',
    apiproduct: 'ucpath-employeemap'
  },
  {
    email: 'steven.maglio@sa.ucsb.edu',
    developerApplication: 'app-smaglio',
    status: 'approved',
    apiproduct: 'sa-quartercalendar-oauth'
  },
  {
    email: 'christian.montecino@ucsb.edu',
    developerApplication: 'app-christian',
    status: 'approved',
    apiproduct: 'administration-financial-accounts-chartfield'
  },
  {
    email: 'apphelp@arit.ucsb.edu',
    developerApplication: 'res-dining-meal-plan-ordering',
    status: 'approved',
    apiproduct: 'students-registrations'
  },
  {
    email: 'gary.scott@ucsb.edu',
    developerApplication: 'test-res-dining-meal-plan-ordering',
    status: 'approved',
    apiproduct: 'students-registrations'
  },
  {
    email: 'kevin.wu@gmail.com',
    developerApplication: 'kevinwu-single-approved',
    status: 'approved',
    apiproduct: 'ucpath-employeemap'
  },
  {
    email: 'kevin.wu@gmail.com',
    developerApplication: 'kevinwu-double-approved',
    status: 'approved',
    apiproduct: 'students-lookups'
  },
  {
    email: 'kevin.wu@gmail.com',
    developerApplication: 'kevinwu-double-approved',
    status: 'approved',
    apiproduct: 'ucpath-employeemap'
  },
  {
    email: 'gary.scott@ucsb.edu',
    developerApplication: 'gary-app',
    status: 'approved',
    apiproduct: 'housing-dates'
  },
  {
    email: 'gary.scott@ucsb.edu',
    developerApplication: 'gary-app',
    status: 'approved',
    apiproduct: 'dining-cams'
  },
  {
    email: 'kevin.wu@gmail.com',
    developerApplication: 'kevinwu-double-mixed',
    status: 'approved',
    apiproduct: 'ucpath-employeemap'
  }
]

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

  // const maxPropertyLength = property => {
  // }

  const text = (sample = []) => {
    const qq = Object.keys(sample[0] || {}).map(key => [
      key,
      Math.max(...sample.map(app => app[key].length), key.length)
    ])

    console.log('qq', qq)
    

    return `\`\`\`hello\`\`\``
  }

  robot.respond(/a/i, res => {
    // apiProducts('approved')
    //   .then(result => console.log('done', result))
    //   .catch(console.log)

    res.send({
      // text: '*bold* `code` _italic_ ~strike~',
      text: text(sample),
      mrkdwn: true
    })
  })
}
