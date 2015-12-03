angular.module("smart.logviewer.services", [])
.service("logService", function(logModel, $http, logviewer, promiseFactory, urlBuilder) {
	
	this.getLogs = function(options) {
		var promise = promiseFactory.getPromise();
		
		if (logModel.logs) {
			promise.resolve(logModel.logs);			
		}
		else {
			$http.get(logviewer.api)
			.success(function(data) {
				// store data.logs
				logModel.logs = data.logs;
				promise.resolve(data.logs);
			})
			.error(function(data) {
				promise.reject(data);
			});
		}
		
		return promise;
	};
});