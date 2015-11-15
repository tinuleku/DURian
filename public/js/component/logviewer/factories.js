angular.module("smart.logviewer.factories", [])
.factory("promiseFactory", function($timeout) {
	var promise = function() {
		
		var successFn, errorFn;
		var self = this;
		
		this.success = function(fn) {
			successFn = fn;
			return self;
		};
		
		this.error = function(fn) {
			errorFn = fn;
			return self;
		};
		
		this.resolve = function(data) {
			$timeout(function() {
				if (successFn) successFn(data);
			}, 1);
		};
		
		this.reject = function(data) {
			setTimeout(function() {
				if (errorFn) errorFn(data);
			}, 1);
		};
	};
	
	this.getPromise = function() {
		return new promise();
	};
	
	return this;
})
.factory("logModel", function() {
	return this;
});