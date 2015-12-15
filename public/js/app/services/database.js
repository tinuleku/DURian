angular.module("durian.services.database", [])
.service("databaseService", function(apiRoot, $http, promiseFactory, urlBuilder) {
	
	this.getDocuments = function(options) {
		
		var deferred = promiseFactory.defer();
		
		var url = urlBuilder(apiRoot + "/documents?", options);
		$http.get(url)
		.success(function(data) {
			deferred.resolve({documents: data.documents, count: data.count});
		})
		.error(function(data) {
			deferred.reject(data);
		});
		
		return deferred.promise;
	};
	
	this.getCollections = function() {
		
		var deferred = promiseFactory.defer();
		var url = apiRoot + "/collections";
		$http.get(url)
		.success(function(data) {
			deferred.resolve(data.collections);
		})
		.error(function(data) {
			deferred.reject(data);
		});
		
		return deferred.promise;
	};
});