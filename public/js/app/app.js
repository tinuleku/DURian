angular.module("durian", [
	// libs
	"ui.router",
	"satellizer",
	"smart.logviewer",
	"smart.tools",
	// app
	"durian.controllers",
	"durian.services",
	"durian.directives",
	"durian.factories"
])
.config(function($provide, $stateProvider, $urlRouterProvider, logviewerProvider, $authProvider){
  	
  	// API
    var apiRoot = "/api";
    $provide.value('apiRoot', apiRoot);
    
    // Logs
    logviewerProvider.api = apiRoot + "/logs";
    
    // Satellizer config
	$authProvider.loginUrl = apiRoot + "/login/local"; //URL to API server
	
    // default routing
	$urlRouterProvider.otherwise('/');
    
    $stateProvider
		.state("dashboard", {
			url: "/dashboard",
			templateUrl: "/view/dashboard.html",
			controller: "DashboardCtrl"
		})
		.state("explorer", {
			url: "/explorer",
			templateUrl: "/view/explorer.html",
			controller: "DatabaseViewerCtrl"
		})
		.state("home", {
			url: "/",
			templateUrl: "/view/home.html",
			controller: "HomeCtrl"
		})
		.state("login", {
			url: "/login",
			templateUrl: "/view/login.html",
			controller: "LoginCtrl"
		});
})
.filter('capitalize', function() {
	return function(input, all) {
    	var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
    	return (!!input) ? input.replace(reg, function(txt){
    		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    	}) : '';
    };
})
.controller("Ctrl", function() {});