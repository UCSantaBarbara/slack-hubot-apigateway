const { apigeeClient, toData } = require('../utils/apigeeClient')

const getDeveloper = developer =>
  toData(
    developer
      ? apigeeClient.get('/developers' + `/${developer}`)
      : apigeeClient.get('/developers')
  )

const getDeveloperApps = (developer, app) =>
  toData(apigeeClient.get(`/developers/${developer}/apps/${app}`))

module.exports = {
    getDeveloper,
    getDeveloperApps
}