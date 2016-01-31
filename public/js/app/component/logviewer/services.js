angular.module("smart.logviewer.services", [])
.service("logService", function($http, logviewer, promiseFactory, urlBuilder) {
	
	this.getLogs = function(options) {
		var deferred = promiseFactory.defer();
		
		$http.get(urlBuilder(logviewer.api + "?", options))
		.success(function(data) {
			// reverse data.logs
			deferred.resolve(data.logs.reverse());
		})
		.error(function(data) {
			deferred.reject(data);
		});
		
		return deferred.promise;
	};
});