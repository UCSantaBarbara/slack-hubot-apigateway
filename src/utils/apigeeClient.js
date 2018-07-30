const axios = require('axios')
const ApigeeAuth = require('apigee-auth')

const apigeeAuth = new ApigeeAuth(
  process.env.APIGEE_USERNAME,
  process.env.APIGEE_PASSWORD
)

const apigeeClient = axios.create({
  baseURL: 'https://api.enterprise.apigee.com/v1/organizations/ucsb'
})

apigeeClient.interceptors.request.use(
  async config => {
    const { access_token } = await apigeeAuth.getToken()
    return Promise.resolve({
      ...config,
      headers: {
        Authorization: `Bearer ${access_token}`,
        ...(config.data && config.data.headers ? config.data.headers : {})
      }
    })
  },
  err => Promise.reject(err)
)

const toData = promise => promise.then(result => result.data)

module.exports = { apigeeClient, toData }
