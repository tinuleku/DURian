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
	var connectionURI = buildConnectionURI(info.database, info.user, info.password);
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
	if (!info) return next({status: 400, message: "invalid input"});
	if (!info.connection) return next({status: 400, message: "missing connection"});
	if (!info.collection) return next({status: 400, message: "missing collection"});
	if (!info.selector) return next({status: 400, message: "missing selector"});
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
			selector: info.selector
		});
		record.save(function(err) {
			if (err) {
				winston.error("Services | error when retrieving");
			}
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
	checkApplyOperationInput(info, next, function(data) {
		
	});
	if (!info) return next({status: 400, message: "invalid input"});
	if (!info.connection) return next({status: 400, message: "missing connection"});
	if (!info.collection) return next({status: 400, message: "missing collection"});
	if (!info.selector) return next({status: 400, message: "missing selector"});
	// process operation
	winston.info("Services | apply operation for user " + info.user + " on collection " + info.collection + " with selector " + info.selector + " and update " + info.update);
	// retrieve what is currently in the db
	var db = info.connection;
	
}

function checkApplyOperationInput(input, next) {
	if (!input) return next({status: 400, message: "invalid input"});
	if (!input.connection) return next({status: 400, message: "missing connection"});
	if (!input.collection) return next({status: 400, message: "missing collection"});
	if (!input.selector) return next({status: 400, message: "missing selector"});
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