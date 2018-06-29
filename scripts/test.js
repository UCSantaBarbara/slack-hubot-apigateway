// Description:
//   holiday detector script
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot developers  - return apigee developer emails


const { getDeveloper, getDeveloperApps } = require('../src/endpoints/apigeeActions')

module.exports = function(robot) {
    robot.respond(/developers/i, function(msg){
        msg.reply(getDeveloper());
    });
}