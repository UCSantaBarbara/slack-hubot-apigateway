const { spawn } = require('cross-spawn')
const dotenv = require('dotenv')
const fs = require('fs')
const dateformat = require('dateformat')

//  add environment variables and setup slack arguments
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env' })
}

//      slack arg: log path
var logPath = process.env.HUBOT_LOG_PATH
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs')
}

logDate = dateformat(new Date(), "yyyy-mm-dd'T'HHMMss")
logFilename = logDate + '.log'
//logFilePath = logPath + "\\" + logFilename
logFilePath = 'logs' + '\\' + logFilename

//  run hubot and handle output
const spawned = spawn('node_modules/.bin/hubot', process.argv.slice(2))

spawned.stdout.on('data', data => {
  console.log(`stdout: ${data}`)
  fs.appendFileSync(logFilePath, data)
})

spawned.on('close', code => {
  console.log(`child process exited with code ${code}`)
})
