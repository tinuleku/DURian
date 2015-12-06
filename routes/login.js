var cfg 				= require('../config');

var jwt					= require('jwt-simple');
var moment				= require('moment');
var winston 			= require('winston');

var checker				= require('./checker.js');

var User 				= require('../models/users.js');
var SvcIndex			= require('../services/index.js');

var ConnectionHandler	= require('./connection_manager.js');

/**
 * Generate a token for user
 */
function createJWT(user_id) {
	var payload = {
		sub: user_id,
		iat: moment().unix(),
		exp: moment().add(14, 'days').unix()
	};
	return jwt.encode(payload, cfg.secret);
}

/**
 * Generate a token for admin user
 */
function createAdminJWT(user) {
	var payload = {
		admin: true,
		iat: moment().unix(),
		exp: moment().add(1, 'hours').unix()
	};
	return jwt.encode(payload, cfg.secret);
}

module.exports = function(app) {
	
	app.route('/login')
		
		// Check if the user is logged in
		.get(function(req, res) {			
			checker.extractDataFromToken(req, function(payload) {
				if (payload && payload.sub) {
					return res.send({
		            	status: 200,
		                loggedIn: true, 
		                userId: payload.sub
		            });
				}
				return res.send({
	            	status: 200,
	                loggedIn: false
	            });
			});
		});
		

    app.route('/login/local')
    	.post(function(req, res, next) {
	        // Simple check on provided fields
	        if (!req.body) {
		        res.status(400);
                return res.send({status: 400, code: 40001, message: 'Missing credentials'}); 
	        }
	        var credentials = {
	            database: req.body.database,
	            user: req.body.username,
	            password: req.body.password,
	            databaseType: req.body.databaseType
	        };
	        SvcIndex.authenticate(credentials, function(data) {
	            if (data.status == 200) {
		            return User.findOne({name: credentials.user | "", database: credentials.database}, function(err, user) {
			            if (err) {
				            
			            }
			            if (!user) {
				            winston.info("Route login | user not registered, creating a record");
				            var user = new User({
					           	name: credentials.user | "",
					           	database: credentials.database 
				            });
				            user.save(function(err) {
					            if (err) {
						            return winston.error("Route Login | error when creating user : " + err);
					            }
					            winston.info("Route Login | user " + credentials.user + " created for database " + credentials.database);
				            });
			            }
			            // store the connection
			            ConnectionHandler.store(user._id, data.connection);
			            delete data.connection;
			            res.status(data.status).send(data);
		            });
	            }
	            return res.status(data.status).send(data);
	        });
	    });
	
	// ADMIN
	app.route('/admin/login')
		
		.get(function(req, res) {
			checker.extractDataFromToken(req, function(payload) {
				if (payload && payload.sub && payload.admin) {
					return res.send({
		            	status: 200,
		                login: true
		            });
				}
				return res.send({
	            	status: 200,
	                login: false, 
	                message: 'Unauthorized access'
	            });
			});
		})
		
		.post(function(req, res) {
			if (req.body.login == "admin") {
		        if (req.body.password == "durian$2015") {
		            return res.send({
	                    status:200,
	                    login: true,
	                    token: createAdminJWT() 
	                });
		        }
		    }
		    res.status(401);
		    return res.send({status: 401});
		});
};