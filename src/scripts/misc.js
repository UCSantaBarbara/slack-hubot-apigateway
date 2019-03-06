// Commands:
//   hubot misc version - returns the HEAD commit sha and date that is currently running

module.exports = robot => {
  //returns the currently deployed version on Heroku, useful for determining what version is running in production
  robot.respond(/misc version/i, async res => {
    // https://devcenter.heroku.com/articles/dyno-metadata
    const {
      HEROKU_RELEASE_CREATED_AT,
      HEROKU_RELEASE_VERSION,
      HEROKU_SLUG_COMMIT,
      HEROKU_SLUG_DESCRIPTION
    } = process.env

    if (HEROKU_SLUG_COMMIT) {
      res.send(
        `Hubot is running version \`${HEROKU_SLUG_COMMIT} (${HEROKU_RELEASE_VERSION})\`` +
          `\nDescription is \`${HEROKU_SLUG_DESCRIPTION}\`` +
          `\nReleased to Heroku Production on \`${HEROKU_RELEASE_CREATED_AT}\``
      )
    } else {
      res.send(
        'The `misc version` command is only available via a Heroku deployed instance.  It does not work locally.'
      )
    }
  })
}
