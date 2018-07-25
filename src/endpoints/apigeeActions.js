const { apigeeClient, toData } = require('../utils/apigeeClient')

const getDeveloper = developer =>
  toData(
    developer
      ? apigeeClient.get('/developers' + `/${developer}`)
      : apigeeClient.get('/developers')
  )

const getDeveloperApps = (developer, app) =>
  toData(apigeeClient.get(`/developers/${developer}/apps/${app}`))

const postDeveloperApp = (developer, app, status) =>
  apigeeClient.post(`/developers/${developer}/apps/${app}?action=${status}`, {
    headers: {
      'Content-Type': 'application/octet-stream'
    }
  })

const postDeveloperAppProduct = (
  developer,
  app,
  product,
  consumerKey,
  status
) =>
  apigeeClient.post(
    `developers/${developer}/apps/${app}/keys/${consumerKey}/apiproducts/${product}?action=${status}`,
    {
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    }
  )

module.exports = {
  getDeveloper,
  getDeveloperApps,
  postDeveloperApp,
  postDeveloperAppProduct
}
