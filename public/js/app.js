angular.module("durian", [
	// libs
	"ui.router",
	"smart.logviewer",
	"smart.urlBuilder",
	// app
	"durian.controllers",
	"durian.services",
	"durian.directives"
])
.config(function($provide, $stateProvider, $urlRouterProvider, logviewerProvider){
    logviewerProvider.api = "/api/logs";
    
    $provide.value('apiRoot', "/api");
    
    $urlRouterProvider.otherwise('/');
    
    // default routing
	$stateProvider
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
.controller("Ctrl", function() {});