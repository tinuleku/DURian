var winston = require("winston");
var mongodb = require("mongodb");

var Record = require("../models/records.js");

/**
 * @info: {
 *	@database: database url,
 *	@user: database user (optional),
 *	@password: database user password (optional),
 *	@collection: database collection,
 *	@selector: selector
 *	@update: update
 * }
 * @next: callback
 */
exports.applyOperation = function(info, next) {
	// check input
	if (!info) return next({status: 400, message: "invalid input"});
	if (!info.database) return next({status: 400, message: "missing database"});
	if (!info.collection) return next({status: 400, message: "missing collection"});
	if (!info.selector) return next({status: 400, message: "missing selector"});
	// process operation
	winston.info("Services | apply operation on db " + info.database + " with selector " + info.selector + " and update " + info.update);
	var connectionURI = buildConnectionURI(info.database, info.user, info.password);
	mongodb.client.connect(connectionURI, function(err, db) {
		if (err) {
			winston.error("Services | error when connecting to db " + connectionURI + " : " + err);
			return next({status: 400, message: "invalid connection data"});
		}
		winston.info("Services | connected to database " + db.databaseName);
		// retrieve what is currently in the db
		db.collection(info.collection).find(info.selector).toArray(function(err, documents) {
			if (err) {
				winston.error("Services | error when retrieving documents for selector " + info.selector + " : " + err);
				return next({status: 500, message: "internal server error"});
			}
			var record = new Record({
				selector: info.selector
			});
			record.save(function(err) {
				if (err) {
					winston.error("Services | error when retrieving");
				}
			});
		});
	});
}


function buildConnectionURI(database, user, password) {
	if (user && password) {
		var splits = database.split("//");
		if (splits && splits.length > 0) {
			return splits[0] + user + ":" + password + "@" + splits[1];
		}
		winston.error("Services | error when splitting database url : split result = " + splits);	
	}
	return database;
}