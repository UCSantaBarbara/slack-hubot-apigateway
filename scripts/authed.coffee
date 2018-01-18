# Description:
# Hubot auth example
 
module.exports = (robot) ->
  robot.respond /am [iI] authed/i, (res) ->
    user = robot.brain.userForName(res.message.user.name)
    userRoles = robot.auth.userRoles(user)
    role = "phonetree"
    if robot.auth.hasRole(user, role)
      res.reply "You sure are #{res.message.user.name} (#{userRoles})!"
    else
      res.reply "No, you have #{userRoles}"