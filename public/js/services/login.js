angular.module("durian.services.login", [])
.service("redirectionService", function() {
	var redirectionUrl;
	var defaultUrl = "/dashboard";
	
	this.setRedirection = function(url) {
		redirectionUrl = url;
	};
	
	this.getRedirection = function() {
		if (redirectionUrl) return redirectionUrl;
		return defaultUrl;
	};
})
.service("loginService", function(apiRoot, $http) {

});