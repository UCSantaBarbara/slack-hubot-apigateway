// Description:
//   Attempts to create or update a Target Server
//
// Commands:
//  hubot targetserver list <env> - apigee
//  hubot targetserver (add|update) <env> <name> <hostname> - apigee
//  hubot targetserver delete <env> <name> - apigee

const { WebClient: slackClient } = require('@slack/client')
const cTable = require('console.table')
const { apiProducts } = require('../utils/misc')
const { firstBy } = require('thenby')

const differenceInCalendarDays = require('date-fns/difference_in_calendar_days')
const formatDateTime = require('date-fns/format')

const {
  getTargetServerNames,
  removeTargetServer,
  newTargetServer
} = require('../endpoints/apigeeTargetServer')


module.exports = robot => {
  const slack = new slackClient(robot.adapter.options.token)

  /*
  examples:
  "devs created <number of days>" (shows all.developers whose accounts were created in the last X number of days)
  "devs created" (shows all developers whose accounts were created in the last 24 hours)
  */
  robot.respond(
    /targetserver\ (add|update|delete|remove|list)\ (dev|test|prod)\ ?([a-z\-0-9]+)?\ ?(https?:\/\/)?([^\/]+)?(.*)$/i,
    async res =>
  {
    var action, callPowerShell, env, hostname, name, params, role, startMsg, user, userRoles, output;

    console.log(res.match);

    action    = res.match[1];
    env       = res.match[2];
    name      = res.match[3];
    hostname  = res.match[5];
    
    if (action === "remove") {
      action = "delete";
    }

    // security
    if (action != "list") {
      user = robot.brain.userForName(res.message.user.name);
      userRoles = robot.auth.userRoles(user);
      role = "apigee";
      if (robot.auth.hasRole(user, role) === false) {
        res.send("Only users with the 'apigee' role are able to perform this operation.");
        return;
      }
    }

    params = {
      Action: action,
      Env: env,
      Name: name,
      HostName: hostname
    };

    console.log(params);

    // Send starting response
    switch (action) {
      case "list":
        startMsg = `Listing target servers from ${params.Env} ... `;
        break;
      case "add":
        startMsg = `Adding target server ${params.Env} ${params.Name} ${params.HostName} ... `;
        break;
      case "update":
        startMsg = `Updating target server ${params.Env} ${params.Name} ${params.HostName} ... `;
        break;
      case "delete":
        startMsg = `Deleting target server ${params.Env} ${params.Name} ... `;
    }

    res.send(`\`\`\`${startMsg}\`\`\``);

    try {
      // execute action
      switch(action) {
        case "list":
          result = await getTargetServerNames(env);
          output = result.join('\r\n');
          break;

        case "delete":
          result = await removeTargetServer(env, name);
          output = `Removed ${name} from ${env}`
          break;

        case "add":
          result = await newTargetServer(env, name, hostname);
          output = `Added ${name} to ${env}`
          break;

        case "update":
          result = await newTargetServer(env, name, hostname);
          output = `Updated ${name} to ${env}`
          break;
      }
    } catch(e) {
      console.log(e)

      output = e.message;
    }

    res.send(`\`\`\`${output}\`\`\``);
  });

}
