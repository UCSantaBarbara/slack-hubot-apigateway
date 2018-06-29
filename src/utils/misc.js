const { from } = require('rxjs')
const { map, mergeMap, filter, toArray, mergeAll } = require('rxjs/operators')

const { getDeveloper, getDeveloperApps } = require('../endpoints/apigeeActions')

const apiProducts = () =>
  from(getDeveloper())
    .pipe(
      mergeAll(),
      mergeMap(developer => getDeveloper(developer)),
      filter(developer => developer.apps.length !== 0),
      mergeMap(developer => {
        const { apps, email } = developer
        return from(apps).pipe(
          mergeMap(app => getDeveloperApps(email, app)),
          map(app => ({ email, ...app }))
        )
      }),
      map(app => {
        const { email, name: developerApplication } = app
        //TODO: determine why credentials only have one member
        return app.credentials[0].apiProducts.reduce((products, product) => {
          const { status, apiproduct } = product
          products.push({
            email,
            developerApplication,
            status,
            apiproduct
          })
          return products
        }, [])
      }),
      mergeAll(),
      toArray()
    )
    .toPromise()

module.exports = {
  apiProducts
}
