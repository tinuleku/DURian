angular.module("durian.services.login", [])
.service("redirectionService", function($location) {
	var redirectionUrl;
	var defaultUrl = "/dashboard";
	var loginUrl = "/login";
	
	this.redirectToLogin = function() {
		var currentUrl = $location.path();
		if (loginUrl != currentUrl) redirectionUrl = currentUrl;
		$location.path(loginUrl);
	};
	
	this.redirect = function() {
		var url = defaultUrl;
		if (redirectionUrl) url = redirectionUrl;
		$location.path(url);
	};
});