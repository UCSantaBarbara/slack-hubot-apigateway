# Description:
#   Attempts to create or update a Target Server
#
# Usage:
#   Type "targetserver list <env>"
#   Type "targetserver (add|update) <name> <env> <hostname>"
#   Type "targetserver delete <name> <env>"
# Commands:
#   hubot targetserver list <env> - Apigee
#   hubot targetserver (add|update) <env> <name> <hostname> - Apigee
#   hubot targetserver delete <env> <name> - Apigee

# Require the edge module we installed
edge = require("edge")

# Build the PowerShell that will execute
executePowerShell = edge.func('ps', -> ###
	# Dot source the function
	. .\scripts\Output.ps1
	. .\scripts\Logs.ps1
	. .\scripts\TargetServer-Set.ps1

	TargetServer-Set -Action $inputFromJs.Action -Environment $inputFromJS.Env `
		-Name $inputFromJS.Name -HostName $inputFromJS.HostName
###
)

module.exports = (robot) ->
	# Capture the user message using a regex capture to find the name of the service
	robot.respond /targetserver\ (add|update|delete|remove|list)\ (dev|test|prod)\ ?([a-z\-0-9]+)?\ ?(https?:\/\/)?([^\/]+)?(.*)$/i, (msg) ->

		console.log msg.match

		action = msg.match[1]
		env = msg.match[2]
		name = msg.match[3]
		hostname = msg.match[5]

		if action is "remove"
			action = "delete"

		# security
		if `action != "list"`
			user = robot.brain.userForName(msg.message.user.name)
			userRoles = robot.auth.userRoles(user)
			role = "apigee"

			if robot.auth.hasRole(user, role) == false
		    	msg.send "Only users with the 'apigee' role are able to perform this operation."
		    	return



		params = {
			Action: action,
			Env: env,
			Name: name,
			HostName: hostname
		}

		console.log params

		# Build the PowerShell callback
		callPowerShell = (params, msg) ->
			executePowerShell params, (error,result) ->
				console.log result[0]
				# If there are any errors that come from the CoffeeScript command
				if error
					msg.send ":fire: An error was thrown in Node.js/CoffeeScript"
					msg.send error
				else
					# Capture the PowerShell outpout and convert the JSON that the function returned into a CoffeeScript object
					result = JSON.parse result[0]

					# Output the results into the Hubot log file so we can see what happened - useful for troubleshooting
					console.log result

					# Check in our object if the command was a success (checks the JSON returned from PowerShell)
					# If there is a success, prepend a check mark emoji to the output from PowerShell.
					if result.success is true
						# Build a string to send back to the channel and include the output (this comes from the JSON output)
						msg.send "```#{result.output}```"
					# If there is a failure, prepend a warning emoji to the output from PowerShell.
					else
						# Build a string to send back to the channel and include the output (this comes from the JSON output)
						msg.send "#{result.output}"

		# Send starting response
		switch action
			when "list" then startMsg = "Listing target servers from #{params.Env} ... "
			when "add" then startMsg = "Adding target server #{params.Env} #{params.Name} #{params.HostName} ... "
			when "update" then startMsg = "Updating target server #{params.Env} #{params.Name} #{params.HostName} ... "
			when "delete" then startMsg = "Deleting target server #{params.Env} #{params.Name} ... "

		msg.send "```#{startMsg}```"

		# Call PowerShell function
		callPowerShell params, msg
