var winston = require("winston");

var User = require("../models/users.js");

/**
 * Get user details
 */
exports.getUser = function(userId, next) {
	winston.info("SvcUser | Get details for user " + userId);
	User.findOne({_id: userId}, function(err, user) {
		if (err) {
			winston.error("SvcUser | error when getting details for user " + userId + " : " + err);
			return next({status: 500, message: "internal server error"});
		}
		return next({status: 200, user: user});
	});
};