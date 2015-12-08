var winston = require("winston");
var mongodb = require("mongodb");

var Record = require("../models/records.js");

/**
 * params
 * @info: {
 *	@database: database url,
 *	@password: database user password (optional),
 *	@collection: database collection
 * }
 * @next: callback
 */
exports.authenticate = function(info, next) {
	// check input
	if (!info) return next({status: 400, message: "invalid input"});
	if (!info.database) return next({status: 400, message: "missing database"});
	var connectionURI = buildConnectionURI(info.database, info.user, info.password, info.databaseType);
	winston.debug("SvcIndex | connectionURI  = " + connectionURI);
	mongodb.MongoClient.connect(connectionURI, function(err, db) {
		if (err) {
			winston.error("Services | error when connecting to db " + connectionURI + " : " + err);
			return next({status: 400, message: "invalid connection data"});
		}
		winston.info("Services | connected to database " + db.databaseName);
		return next({status: 200, connection: db});
	});	
}

/**
 * @info: {
 *	@connection: database connector,
 *	@user: database user (optional),
 *	@collection: database collection,
 *	@selector: selector
 *	@update: update
 * }
 * @next: callback
 */
exports.applyOperation = function(info, next) {
	// check input
	checkInputForOperation(info, next, function(data) {
		// process operation
		winston.info("Services | apply operation for user " + info.user + " on collection " + info.collection + " with selector " + info.selector + " and update " + info.update);
		// retrieve what is currently in the db
		var db = info.connection;
		db.collection(info.collection).find(info.selector).toArray(function(err, documents) {
			if (err) {
				winston.error("Services | error when retrieving documents for selector " + info.selector + " : " + err);
				return next({status: 500, message: "internal server error"});
			}
			var record = new Record({
				user: info.user,
				selector: info.selector,
				documents: {}
				status: "Draft"
			});
			// Check if document
			
			record.save(function(err) {
				if (err) {
					winston.error("Services | error when retrieving");
				}
			});
		});
	});
}

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
exports.applyOperationBulk = function(info, next) {
	// check input
	checkInputForOperation(info, next, function(data) {
		// process operation
		winston.info("Services | apply operation for user " + info.user + " on collection " + info.collection + " with selector " + info.selector + " and update " + info.update);
		// retrieve what is currently in the db
		var db = info.connection;
	});	
}

function checkInputForOperation(input, next) {
	if (!input) return next({status: 400, message: "invalid input"});
	if (!input.connection) return next({status: 400, message: "missing connection"});
	if (!input.collection) return next({status: 400, message: "missing collection"});
	if (!input.selector) return next({status: 400, message: "missing selector"});
}

function buildConnectionURI(database, user, password, databaseType) {
	var splits = database.split("://");
	var url = database;
	if (user && password) {
		if(splits.length > 1) {
			return splits[0] + "://" + user + ":" + password + "@" + splits[1];
		}
		else url = user + ":" + password + "@" + splits[0];
	}
	if (splits.length < 2 && databaseType) {
		return databaseType + "://" + url;
	}
	return database;
}