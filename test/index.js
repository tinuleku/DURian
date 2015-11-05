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
	})
})