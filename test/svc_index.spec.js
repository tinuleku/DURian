var mocha = require('mocha');
var should = require('should');

var Svc = require('../services/index.js');

describe("index", function() {
	describe("authenticate", function() {
		describe("missing info", function() {
			it("should send back a 400 error message", function() {
				Svc.authenticate(null, function(data) {
					should(data.status).equal(400);
					should(data.message).equal("invalid input");
				})
			});

		})
		
		describe("missing database", function() {
			it("should send back a 400 error message", function() {
				Svc.authenticate({
					user: "toto"
				}, function(data) {
					should(data.status).equal(400);
					should(data.message).equal("missing database");
				})
			});

		})
		
		describe("valid input", function() {
			it("should send back a valid connection", function() {
				Svc.authenticate({
					database: "mongodb://localhost:27017/api"
				}, function(data) {
					should(data.status).equal(200);
					console.log(data.connection);
					should(data.connection).not.be(null);
				})
			});

		})
	})
})