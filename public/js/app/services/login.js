angular.module("durian.services.login", [])
.service("redirectionService", function($location, $injector) {
	var redirectionUrl;
	var redirectionState;
	var redirectionParams;
	var defaultUrl = "/dashboard";
	var loginUrl = "/login";
	var loginState = "login";
	
	this.redirectToLogin = function() {
		var currentUrl = $location.path();
		if (loginUrl != currentUrl) redirectionUrl = currentUrl;
		$location.path(loginUrl);
	};
	
	this.setRedirectionState = function(state, params) {
		if (state.name != loginState) {
			redirectionUrl = undefined;
			redirectionState = state;
			redirectionParams = params;
		}
	};
	
	this.setRedirectionUrl = function(url) {
		if (url != loginUrl) {
			redirectionState = undefined;
			redirectionUrl = url;
		}
	};
	
	this.redirect = function() {
		if (redirectionState) {
			var $state = $injector.get("$state");
			return $state.go(redirectionState.name, redirectionParams);
		}
		var url = defaultUrl;
		if (redirectionUrl) url = redirectionUrl;
		$location.path(url);
	};
});