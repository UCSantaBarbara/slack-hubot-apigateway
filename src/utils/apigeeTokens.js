const axios = require('axios')
const querystring = require('querystring')

const { oauthTokenUrl } = require('./apigeeAuthConfig')

const OTPAuth = require('otpauth')

const getMfaToken = secret =>
  new OTPAuth.TOTP({
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromB32(secret)
  }).generate()

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    //edgecli:edgeclisecret (hardcoded per Apigee docs)
    Authorization: 'Basic ZWRnZWNsaTplZGdlY2xpc2VjcmV0',
    Accept: 'application/json;charset=utf-8'
  }
}

const getTokenFromUsername = (username, password, totpSecret) =>
  axios(oauthTokenUrl, {
    ...options,
    data: querystring.stringify({
      username,
      password,
      grant_type: 'password',
      ...(totpSecret && { mfa_token: getMfaToken(totpSecret) })
    })
  }).then(result => result.data)

const getTokenFromRefreshToken = refresh_token =>
  axios(oauthTokenUrl, {
    ...options,
    data: querystring.stringify({
      refresh_token,
      grant_type: 'refresh_token'
    })
  }).then(result => result.data)

module.exports = { getTokenFromUsername, getTokenFromRefreshToken }
