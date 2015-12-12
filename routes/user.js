var winston = require("winston");

var checker = require("./checker.js");

module.exports = function(app) {
		
	app.route("/users/:id")
		.get(checker.checkLogin, function(req, res) {
			
		});	
			
	app.route("/users/:id/records")
		.get(checker.checkLogin, function(req, res) {
			
		});
		
}