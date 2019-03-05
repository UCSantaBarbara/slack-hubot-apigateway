// Commands:
//   hubot misc version - returns the HEAD commit sha and date that is currently running

const Git = require('nodegit')

module.exports = robot => {
  //returns the current git sha hash, useful for determining what version is running in production
  robot.respond(/misc version/i, async res => {
    const currentRepo = await Git.Repository.open(process.cwd())
    const head = await currentRepo.getHeadCommit()

    res.send(
      `Hubot is running version \`${head.sha()}\`` +
        `\ncommitted on: \`${head.date()}\`` +
        `\nby: \`${head.author().name()}\``
    )
  })
}
