const {
	getTokenFromUsername,
	getTokenFromRefreshToken
  } = require('./apigeeTokens')
  
  module.exports = class ApigeeAuth {
	constructor(username, password, totpSecret) {
	  this.__username = username
	  this.__password = password
	  this.__totpSecret = totpSecret
  
	  this.__token = null
  
	  this.__accessTokenExpireAt = null
	  this.__refreshTokenExpireAt = null
  
	  this.getToken = this.getToken.bind(this)
	}
  
	currentSeconds() {
	  return Math.floor(new Date().getTime() / 1000)
	}
  
	useUsernamePassword(username, password, totpSecret) {
	  return getTokenFromUsername(username, password, totpSecret).then(data =>
		this.setAccessToken(data)
	  )
	}
  
	useRefreshToken(refreshToken) {
	  return getTokenFromRefreshToken(refreshToken).then(data =>
		this.setAccessToken(data, true)
	  )
	}
  
	setAccessToken(token, isUsingRefreshToken) {
	  this.__token = token
	  this.__accessTokenExpireAt = this.currentSeconds() + token.expires_in - 60 //buffer 60 seconds
  
	  if (!isUsingRefreshToken) {
		this.__refreshTokenExpireAt = this.currentSeconds() + 84600 - 60 //buffer 60 seconds
	  }
  
	  return this.__token
	}
  
	getToken() {
	  if (this.currentSeconds() > this.__refreshTokenExpireAt) {
		return this.useUsernamePassword(
		  this.__username,
		  this.__password,
		  this.__totpSecret
		)
	  }
  
	  if (this.currentSeconds() > this.__accessTokenExpireAt) {
		const { refresh_token } = this.__token
		return this.useRefreshToken(refresh_token)
	  }
  
	  return Promise.resolve(this.__token)
	}
  }
  