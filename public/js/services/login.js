angular.module("durian.services.login", [])
.service("loginService", function(apiRoot, $http) {
	
	this.authenticate = function() {
		
	};
	
	this.login = function(credentials) {
		return $http.post(apiRoot + "/login/local", credentials);
	};
});