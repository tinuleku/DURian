var express			= require("express");
var morgan         	= require("morgan");
var bodyParser     	= require("body-parser");
var cookieParser 	= require("cookie-parser");
var methodOverride 	= require("method-override");
var http			= require("http");
var mongoose		= require("mongoose");
var winston 		= require("winston");

var config = require("./config");

var app = express();

/**
 * Requiring "winston-mongodb" will expose winston.transports.MongoDB
 */
require("winston-mongodb").MongoDB;

winston.remove(winston.transports.Console);
winston.add(winston.transports.MongoDB, config.winston);

app.use(express.static(__dirname + "/public/dist")); 	// set the static files location /public/img will be /img for users
app.use(morgan("dev")); 								// log every request to the console
app.use(bodyParser.urlencoded({
  	extended: true
}));
app.use(bodyParser.json()); 							// pull information from html in POST
app.use(methodOverride()); 								// simulate DELETE and PUT
app.use(cookieParser());								// Parser cookie if needed (especially for auth)

function connectToDB(next) {
	// Do not connect to database on test, it is done elsewhere
	if (process.env.NODE_ENV != 'test') {
		mongoose.connect(config.mongodb.uri, function(err, db) {
			if (err) return winston.info("Failed to connected to URI : " + config.mongodb.uri);
			winston.info("App | Successfully connected to db");
			next(true);
		});
	}
	else {
		next();
	}
}

connectToDB(function(connected) {
	var router = express.Router();  					// get an instance of the express Router
	
	require("./routes/log.js")(router);
	require("./routes/login.js")(router);
	
	app.use("/api", router);							// Declare the API base route
	
	app.get("/", function(req, res) {
		return res.sendFile('index.html', {root: __dirname + '/public/dist'});
	});
	
	httpInstance = http.createServer(app);
	//https.createServer(options, app).listen(config.port);
	
	httpInstance.listen(config.port);
	winston.info("App | Creating a server on port " + config.port);
});