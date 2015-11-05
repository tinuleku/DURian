var winston = require("winston");

//  singleton shared 
// TODO to be defined as a proper object in a separeted class
var connectionHandler = {
	get: function(userId) {
		return null;
	}
};

var extractDataFromToken = function(req, next) {
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
}

exports.checkLogin = function(req, res, next) {
	extractDataFromToken(req, function(payload) {
    	if (!payload) {
			return res.status(401).send({status: 401, message: "Unauthorized access" });
		}
		req.user = payload.sub;
		// attach the db connection to the request
		req.connection = connectionHandler.get(req.user);
		if (!req.connection) {
			return res.status(401).send({status: 401, message: "Outdated connection" });
		}
		return next();
    });
}