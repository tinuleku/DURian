var winston = require("winston");

var checker = require("./checker.js");

/**
 * Factory for usual callback
 */
var simpleResponse = function(res) {
	return function(data) {
		return res.status(data.status).send(data);
	};
};

module.exports = function(app) {
	
	app.route("/records")
		.get(checker.checkLogin, function(req, res) {
			if (req.param("summary")) {
				var options = {
					
				};
				return SvcRecord.getRecordSummaries(req.user, options, simpleResponse(res));
			}
			return res.status(400).send({status: 400, message: "Invalid input"});
		})
		
		.post(checker.checkLogin, function(req, res) {
			// create a record
		});
		
	app.route("/records/:id")
		.get(checker.checkLogin, function(req, res) {
			// get record
			return SvcRecord.setRecordUpdate(req.param("id"), req.user, simpleResponse(res));
		})
		
		.put(checker.checkLogin, function(req, res) {
			// update record
			if (req.body.update) {
				return SvcRecord.setRecordUpdate(req.body.update, req.user, req.param("id"), simpleResponse(res));
			}
			return res.status(400).send({status: 400, message: "Invalid input"});
		});
}