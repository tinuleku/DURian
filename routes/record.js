var winston = require("winston");

var checker = require("./checker.js");

module.exports = function(app) {
	
	app.route("/records")
		.get(checker.checkLogin, function(req, res) {
			// get records
		})
		
		.post(checker.checkLogin, function(req, res) {
			// create a record
		});
		
	app.route("/records/:id")
		.get(checker.checkLogin, function(req, res) {
			// get record
		})
		
		.put(checker.checkLogin, function(req, res) {
			// update record
			if (req.body.update) {
				return SvcRecord.setRecordUpdate(req.body.update, req.param("id"), function(data) {
					return res.status(data.status).send(data);
				});
			}
			return res.status(400).send({status: 400, message: "Invalid input"});
		});
}