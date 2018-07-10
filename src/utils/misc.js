const { from } = require('rxjs')
const { map, mergeMap, filter, toArray, mergeAll } = require('rxjs/operators')

const { getDeveloper, getDeveloperApps } = require('../endpoints/apigeeActions')

const apiProducts = () =>
  from(getDeveloper())
    .pipe(
      mergeAll(),
      mergeMap(developer => getDeveloper(developer)),
      mergeMap(developer => {
        const { apps, email } = developer
        return from(apps).pipe(
          mergeMap(app => getDeveloperApps(email, app)),
          map(app => ({ email, ...app }))
        )
      }),
      map(app => {
        const { email: developer, name: developerApp, status: appStatus } = app

        //TODO: determine why credentials only have one member
        const apiProducts = app.credentials[0].apiProducts

        if (apiProducts.length == 0) {
          return [
            {
              developer,
              developerApp,
              appStatus,
              apiproduct: '---',
              apiStatus: '---'
            }
          ]
        } else {
          return apiProducts.reduce((products, product) => {
            const { status: apiStatus, apiproduct } = product
            products.push({
              developer,
              developerApp,
              appStatus,
              apiproduct,
              apiStatus
            })
            return products
          }, [])
        }
      }),
      mergeAll(),
      toArray()
    )
    .toPromise()

module.exports = {
  apiProducts
}
