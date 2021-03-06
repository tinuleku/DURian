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

winston.remove(winston.transports.Console);

// production
if (process.env.OPENSHIFT_NODEJS_PORT) {
  /**
  * Requiring "winston-mongodb" will expose winston.transports.MongoDB
  */
  require("winston-mongodb").MongoDB;
  winston.add(winston.transports.MongoDB, config.winston);
}
else {
  winston.add(winston.transports.Console, {
    colorize: true,
    prettyPrint: true,
    timestamp: true
  });
}

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
	
	require("./routes/database.js")(router);
	require("./routes/log.js")(router);
	require("./routes/login.js")(router);
	require("./routes/record.js")(router);
	require("./routes/user.js")(router);
	
	app.use("/api", router);							// Declare the API base route
	
	app.get("/", function(req, res) {
		return res.sendFile('index.html', {root: __dirname + '/public/dist'});
	});
	
	httpInstance = http.createServer(app);
	//https.createServer(options, app).listen(config.port);
	
	// hack for hosting
	var serverPort = process.env.OPENSHIFT_NODEJS_PORT || config.port;
	var serverIPAddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
	httpInstance.listen(serverPort, serverIPAddress, function() {
		winston.info('Creating a server on port ' + serverPort);
	});
});