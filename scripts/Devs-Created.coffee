# Description:
#   Searches through Developers that were created in the last X days.
#
# Usage:
#   Type "devs created <days = 1>"
# Commands:
#   hubot devs created <days = 1> - Find Devs created in last X days - Apigee

# Require the edge module we installed
edge = require("edge")

# Build the PowerShell that will execute
executePowerShell = edge.func('ps', -> ###
	# Dot source the function
	. .\scripts\Output.ps1
	. .\scripts\Logs.ps1
	. .\scripts\Devs-Created.ps1

	Devs-Created -Days $inputFromJS.Days
###
)

module.exports = (robot) ->
	# Capture the user message using a regex capture to find the name of the service
	robot.respond /devs\ created\ ?([0-9]+)?(.*)$/i, (msg) ->

		console.log msg.match

		days = msg.match[1]

		days = parseInt(days, 10)

		if isNaN(days)
			days = 1

		params = {
			Days: days
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
		msg.send "```Searching ... ```"

		# Call PowerShell function
		callPowerShell params, msg
