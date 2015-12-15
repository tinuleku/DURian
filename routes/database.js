var winston = require("winston");

var checker = require("./checker.js");
var SvcDatabase = require("../services/database.js");

/**
 * Factory for usual callback
 */
var simpleResponse = function(res) {
	return function(data) {
		return res.status(data.status).send(data);
	};
};

module.exports = function(app) {
	
	app.route("/documents")
		.get(checker.checkLogin, function(req, res) {
			var selector;
			try {
				selector = JSON.parse(req.query.selector);
			}
			catch(e) {
				selector = {};
			}
			var options = {
				collection: req.query.collection,
				selector: selector,
				limit: parseInt(req.query.limit) | 10,
				count: req.query.count == "true"
			};
			return SvcDatabase.getDocuments(req.connection, options, simpleResponse(res));
		});
		
	app.route("/collections")
		.get(checker.checkLogin, function(req, res) {
			return SvcDatabase.getCollections(req.connection, simpleResponse(res));
		});
}