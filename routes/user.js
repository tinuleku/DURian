var winston = require("winston");

var checker = require("./checker.js");

var SvcRecord = require("../services/record.js");
var SvcUser = require("../services/user.js");

/**
 * Factory for usual callback
 */
var simpleResponse = function(res) {
	return function(data) {
		return res.status(data.status).send(data);
	};
};

module.exports = function(app) {
		
	app.route("/users/:id")
		.get(checker.checkLogin, function(req, res) {
			SvcUser.getUser(req.user, simpleResponse(res));
		});	
			
	app.route("/users/:id/records")
		.get(checker.checkLogin, function(req, res) {
			SvcRecord.getUserRecords(req.user, {}, simpleResponse(res));
		});
		
}