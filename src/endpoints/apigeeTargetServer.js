const { apigeeClient, toData } = require('../utils/apigeeClient')
const asyncForEach = require('../utils/misc').asyncForEach
const https = require('https')
const http = require('http')


/**
 * Makes a call to the Apigee Management API. It gets the list of target servers for the environment.
 * @param {string} environment - The environment to set a target server in.
 * @returns {(string[])} - Names of the target servers in the environment
 */
const getTargetServerNames = async (environment) => {
  if(["dev", "test", "prod"].indexOf(environment) == -1) {
    throw new Error(`getTargetServerNames: param 'environment' should be one of ['dev', 'test', 'prod']. The passed in value was '${environment}'.`)
  }

  var url = `/environments/${environment}/targetservers`
  var targetServers = await toData(apigeeClient.get(url))

  return targetServers
}

/**
 * @typedef {Object} TargetServer
 * @property {string} host the host name of the target application server
 * @property {bool} isEnabled true/false
 * @property {string} name the name of this object (this target server definition)
 * @property {int} port the port to send on (defaults to 80)
 * @property {TargetServerSslInfo} sSLInfo - the https configuration information
 * 
 * @typedef {Object} TargetServerSslInfo
 * @property {(string[])} ciphers cipher suite to use (I've never used it)
 * @property {string} clientAuthEnabled STRING "true" / "false" - I've never used this (default "false")
 * @property {string} enabled STRING "true" / "false" - need to set this to "true" (default "false" ... why apigee?!?)
 * @property {bool} ignoreValidationErrors true/false
 * @property {(string[])} protocols procotols to use in preference order (just use "TLSv1.2" or above)
 */


/**
 * Makes a call to the Apigee Management API. It gets the list of target servers for the environment.
 * @param {string} environment The environment to set a target server in.
 * @param {string} name The target servers name
 * @returns {TargetServer[]} The target server definition
 */
const getTargetServer = async (environment, name = '') => {
  var names
  if(name == '') {
    names = await getTargetServerNames(environment)
  } else {
    names = [ name ]
  }

  var targetServers = [];
  await asyncForEach(names, async (n) => {
    var url = `/environments/${environment}/targetservers/${n}`
    var server = await toData(apigeeClient.get(url))
    targetServers.push(server)
  });

  return targetServers
}

/**
 * Makes a call to the Apigee Management API. It adds the SNI flag to the Target Server definitions.
 * @param {string} environment The environment to set a target server in.
 * @param {string} name The name of the target server.
 * @param {string} hostname The host name to route to. (ie. registrar.sa.ucsb.edu)
 * @returns {TargetServer} The new/updated target server definition
 */
const newTargetServer = async (environment, name, hostname) => {
  
  if(await testTargetServerExists(environment, name)) {

    var targetServerDefinition = (await getTargetServer(environment, name))[0]

    targetServerDefinition.port = 443
    targetServerDefinition.host = hostname

    if(!targetServerDefinition.sSLInfo) {
      targetServerDefinition.sSLInfo = { enabled: true, protocols: [] }
    }

    targetServerDefinition.sSLInfo.enabled = true
    targetServerDefinition.sSLInfo.protocols = ["TLSv1.2"]

    var url = `/environments/${environment}/targetservers/${name}`
    var response = await apigeeClient.put(url, targetServerDefinition)

    if(response.status < 300) {
      var result = response.data
      return result
    }

    return undefined

  } else {
    //  if the target server doesn't exist, lets create it

    var targetServerParameters = {
      name:  name,
      host: hostname,
      port: 443,
      sSLInfo: {
        enable: true,
        protocols: ["TLSv1.2"]
      }
    }

    var url = `/environments/${environment}/targetservers`
    var response = await apigeeClient.post(url, targetServerParameters)

    if(response.status < 300) {
      var result = response.data
      return result
    }

    return undefined
  }
}

/**
 * Makes a call to the Apigee Management API. It removes a target server.
 * @param {string} environment The environment to set a target server in.
 * @param {string} name The name of the target server.
 * @returns {TargetServer} The removed target server definition
 */
const removeTargetServer = async (environment, name) => {
  
  if(await testTargetServerExists(environment, name)) {
    var url = `/environments/${environment}/targetservers/${name}`
    var response = await apigeeClient.delete(url)

    if(response.status < 300) {
      var result = response.data
      return result
    }
  }

  return undefined
}

/**
 * Makes a call to the Apigee Management API. Checks if a target server exists.
 * @param {string} environment The environment to set a target server in.
 * @param {string} name The name of the target server.
 * @returns {bool} True if the target server configuration exists
 */
const testTargetServerExists = async (environment, name) => {
  var currentList = await getTargetServerNames(environment)
  var found = (currentList.indexOf(name) > -1)
  console.log(`testTargetServerExists: ${found}`)
  return found
}

module.exports = {
  getTargetServerNames,
  getTargetServer,
  newTargetServer,
  removeTargetServer,
  testTargetServerExists
}

  
