var winston = require("winston");

exports.getDocuments = function(connection, info, next) {
	winston.info("Svc Database | get documents");
	if (!info.collection) return next({status: 400, message: "missing collection"});
	if (!info.selector) options.selector = {};
	connection.collection(info.collection).find(info.selector, {skip: info.skip, limit: info.limit}).toArray(function(err, documents) {
		if (err) {
			winston.error("Svc Database | error when retrieving documents from " + info.collection + " inside " + connection.databaseName + " : " + err);
			return next({status: 500, message: "internal server error"});
		}
		if (info.count) {
			return connection.collection(info.collection).find(info.selector).count(function(err, count) {
				if (err) {
					winston.error("Svc Database | error when count documents from " + info.collection + " inside " + connection.databaseName + " : " + err);
					return next({status: 500, message: "internal server error"});
				}
				return next({status: 200, documents: documents, count: count});

			});
		}
		return next({status: 200, documents: documents});
	});
};

exports.getCollections = function(connection, next) {
	winston.info("Svc Database | get collections");
	if (!connection) {
		winston.error("Svc Database | connection not set when calling getCollections");
		return next({status: 500, message: "internal server error"});
	}
	connection.listCollections().toArray(function(err, collections) {
		if (err) {
			winston.error("Svc Database | error when retrieving collections from database " + connection.databaseName + " : " + err);
			return next({status: 500, message: "internal server error"});
		}
		return next({status: 200, collections: collections});
	});
};