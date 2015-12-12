angular.module("smart.logviewer.services", [])
.service("logService", function(logModel, $http, logviewer, promiseFactory, urlBuilder) {
	
	this.getLogs = function(options) {
		var deferred = promiseFactory.defer();
		
		$http.get(urlBuilder(logviewer.api + "?", options))
		.success(function(data) {
			// store data.logs
			logModel.logs = data.logs;
			deferred.resolve(data.logs);
		})
		.error(function(data) {
			deferred.reject(data);
		});
		
		return deferred.promise;
	};
});