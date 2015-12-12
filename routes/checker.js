var winston = require("winston");
var jwt	= require('jwt-simple');
var cfg = require('../config');
var moment = require("moment");

var connectionHandler = require("./connection_manager.js");

var extractDataFromToken = exports.extractDataFromToken = function(req, next) {
	if (!req.headers.authorization) {
		winston.debug("no authorization header");
		return next();
	}
	var token = req.headers.authorization.split(' ')[1];
	
	var payload = null;
	try {
		payload = jwt.decode(token, cfg.secret);
	}
	catch (err) {
		winston.error("Checker | error catched when decoding token : " + err);
		return next();
	}
	
	if (payload.exp <= moment().unix()) {
		return next();
	}
	return next(payload);
};

exports.checkAdmin = function(req, res, next) {
	// TODO be more restrictive :p
	return next();
};

exports.checkLogin = function(req, res, next) {
	extractDataFromToken(req, function(payload) {
    	if (!payload) {
			return res.status(401).send({status: 401, message: "Unauthorized access" });
		}
		req.user = payload.sub;
		// attach the db connection to the request
		connectionHandler.get(req.user, function(err, connection) {
			if (err) {
				winston.error("Checker | error when getting the connection : " + err);
			}
			if (!connection) {
				return res.status(401).send({status: 401, message: "Outdated connection" });
			}
			req.connection = connection;
			return next();
		});
    });
};