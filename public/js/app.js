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
.config(function($provide, $stateProvider, logviewerProvider){
    logviewerProvider.api = "/api/logs";
    
    $provide.value('apiRoot', "/api");
    
    // default routing
	$stateProvider
		.state("login", {
			url: "/login",
			templateUrl: "/view/login.html",
			controller: "LoginCtrl"
		});
})
.controller("Ctrl", function() {});