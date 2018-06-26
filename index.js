const { spawn } = require('cross-spawn')
const dotenv = require('dotenv')
dotenv.config()

const spawned = spawn('node_modules/.bin/hubot', process.argv.slice(2))

spawned.stdout.on('data', data => {
  console.log(`stdout: ${data}`)
})

spawned.on('close', code => {
  console.log(`child process exited with code ${code}`)
})