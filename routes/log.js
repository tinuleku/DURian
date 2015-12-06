var winston = require('winston');

var checker = require('./checker.js');

module.exports = function(app) {
	
	app.route('/logs')
		
		/**
		 * Options:
		 * 	from: Date,
		 *	until: Date,
		 *	limit: Number,
		 *	start: Number,
		 *	order: Enum ("desc"),
		 *	fields: String
		 */
		.get(function(req, res) {
			checker.checkAdmin(req, res, function() {
				var options = {
					start: req.params["start"] | 0,
					limit: req.params["limit"] | 10,
					order: req.params["order"] | "desc"
				};
				if (req.params["from"]) {
					var from = parseInt(req.params["from"]) | 0;
					options.from = new Date(from);
				}
				else {
					options.from = new Date(0);
				}
				if (req.params["until"]) {
					var until = parseInt(req.params["until"]) | 0;
					options.until = new Date(until);
				}
				winston.query(options, function (err, results) {
				    if (err) {
				    	res.send({status: 500, message: "internal server error"});
				      	throw err;
				    }
				
				    res.send({status: 200, logs: results.mongodb});
				});
			});
		});
};
