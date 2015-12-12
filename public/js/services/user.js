angular.module("durian.services.user", [])
.service("userService", function(apiRoot, $http, promiseFactory, urlBuilder, userModel, redirectionService) {
	
	this.getUserId = function() {
		if (userModel.userId) {
			return promiseFactory.when(userModel.userId);
		}
		
		var deferred = promiseFactory.defer();
		$http.get(apiRoot + "/login")
		.success(function(data) {
			userModel.userId = data.userId;
			if (data.loggedIn) deferred.resolve(data.userId);
			else {
				redirectionService.redirectToLogin();
			}
		})
		.error(function(data) {
			deferred.reject(data);
		});
		
		return deferred.promise;
	};
	
	/**
	 * Get user and persist it to the userModel
	 * Cached request
	 */
	this.getUser = function(userId) {
		
		if (userModel.user && userModel.user._id == userId) {
			return promiseFactory.when(userModel.user);
		}
		
		var deferred = promiseFactory.defer();
		$http.get(apiRoot + "/users/" + userId, {cache: true})
		.success(function(data) {
			userModel.user = data.user;
			deferred.resolve(data.user);
		})
		.error(function(data) {
			deferred.reject(data);
		});
		
		return deferred.promise;
	};
	
	/**
	 * Get user records
	 */
	this.getUserRecords = function(userId, options) {
		// TODO add check against the options + rethink
		if (userModel.userRecords && userModel.userId == userId) {
			return promiseFactory.when(userModel.userRecords);
		}
		
		var deferred = promiseFactory.defer();
		var url = urlBuilder(apiRoot + "/users/" + userId + "/records?", options);
		$http.get(url)
		.success(function(data) {
			userModel.records = data.records;
			deferred.resolve(data.records);
		})
		.error(function(data) {
			deferred.reject(data);
		});
		
		return deferred.promise;
	};
	
	this.clearUserData = function() {
		delete userModel.user;
		delete userModel.records;
	};
});