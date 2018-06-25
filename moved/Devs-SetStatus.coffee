###
# Description:
#   Sets a developer (dev portal developer) to active or inactive
#
# Usage:
#   Type "devs status {email} (active|inactive)"
# Commands:
#   hubot devs status {email} (active|inactive) - Set a developer active|inactive - Apigee

# Require the edge module we installed
edge = require("edge")


# Build the PowerShell that will execute
executePowerShell = edge.func('ps', -> ###
###
	# Dot source the function
	. .\scripts\Output.ps1
	. .\scripts\Logs.ps1
	. .\scripts\Devs-SetStatus.ps1

	Devs-SetStatus -Email $inputFromJS.Email -Status $inputFromJS.Status
###
###
)

module.exports = (robot) ->
	# Capture the user message using a regex capture to find the name of the service
	robot.respond /devs\ status\ ([^\ ]+)\ (active|inactive)$/i, (msg) ->

		console.log msg.match

		# security
		user = robot.brain.userForName(msg.message.user.name)
		userRoles = robot.auth.userRoles(user)
		role = "apigee"

		if robot.auth.hasRole(user, role) == false
			msg.send "Only users with the 'apigee' role are able to perform this operation."
			return

		email = msg.match[1]
		status = msg.match[2]

		params = {
			Email: email,
			Status: status
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
		msg.send "```Setting #{params.Email} to #{params.Status} ... ```"

		# Call PowerShell function
		callPowerShell params, msg
###