var mocha = require('mocha');
var should = require('should/as-function');

var Svc = require('../services/index.js');

describe("index", function() {
	
	var connection;
	
	describe("authenticate", function() {
		describe("missing info", function() {
			it("should send back a 400 error message", function(next) {
				Svc.authenticate(null, function(data) {
					should(data.status).be.exactly(400);
					should(data.message).be.exactly("invalid input");
					next();
				})
			});

		});
		
		describe("missing database", function() {
			it("should send back a 400 error message", function(next) {
				Svc.authenticate({
					user: "toto"
				}, function(data) {
					should(data.status).be.exactly(400);
					should(data.message).be.exactly("missing database");
					next();
				});
			});

		});
		
		describe("valid input", function() {
			it("should send back a valid connection", function(next) {
				Svc.authenticate({
					database: "mongodb://localhost:27017/durian"
				}, function(data) {
					should(data.status).be.exactly(200);
					should(data.connection).not.be.exactly(undefined);
					next();
				});
			});
			
			it("should send back a valid connection", function(next) {
				Svc.authenticate({
					database: "localhost:27017/durian",
					databaseType: "mongodb"
				}, function(data) {
					should(data.status).be.exactly(200);
					should(data.connection).not.be.exactly(undefined);
					next();
				});
			});
			
			it("should send a 400 error", function(next) {
				Svc.authenticate({
					database: "localhost:27017/durian",
					user: "toto",
					password: "wrongpwd",
					databaseType: "mongodb"
				}, function(data) {
					should(data.status).be.exactly(400);
					should(data.connection).be.exactly(undefined);
					next();
				})
			});
		});
	});
	
	describe("applyOperation", function() {
		
		before(function(next) {
			Svc.authenticate({
				database: "mongodb://localhost:27017/durian"
			}, function(data) {
				connection = data.connection;
				next();
			});
		});
		
		describe("missing input", function() {
			it("should send back a 400 error message", function(next) {
				Svc.applyOperation(null, function(data) {
					should(data.status).be.exactly(400);
					should(data.message).be.exactly("invalid input");
					next();
				});
			});
		});
		
		describe("empty input", function() {
			it("should send back a 400 error message", function(next) {
				Svc.applyOperation({}, function(data) {
					should(data.status).be.exactly(400);
					should(data.message).be.exactly("missing connection");
					next();
				})
			});
		});
		
		describe("missing collection", function() {
			it("should send back a 400 error message", function(next) {
				Svc.applyOperation({
					connection: connection
				}, function(data) {
					should(data.status).be.exactly(400);
					should(data.message).be.exactly("missing collection");
					next();
				});
			});
		});
		
		describe("missing selector", function() {
			it("should send back a 400 error message", function(next) {
				Svc.applyOperation({
					connection: connection,
					collection: "log"
				}, function(data) {
					should(data.status).be.exactly(400);
					should(data.message).be.exactly("missing selector");
					next();
				});
			});
		});
		
		describe("missing connection", function() {
			it("should send back a 400 error message", function(next) {
				Svc.applyOperation({
					collection: "log"
				}, function(data) {
					should(data.status).be.exactly(400);
					should(data.message).be.exactly("missing connection");
					next();
				});
			});
		});
		
		describe("missing connection", function() {
			it("should send back a 400 error message", function(next) {
				Svc.applyOperation({
					connection: connection,
					collection: "log",
					selector: {}
				}, function(data) {
					should(data.status).be.exactly(400);
					should(data.message).be.exactly("missing connection");
					next();
				});
			});
		});
	});
});