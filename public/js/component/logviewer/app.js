angular.module("smart.logviewer", [
	"ui.router",
	"angularMoment", 
	"smart.logviewer.controllers", 
	"smart.logviewer.services",
	"smart.logviewer.factories"
])
.provider("logviewer", function() {
	this.api = "/logs";
	
	this.$get = function () {
    	return {
	    	api: this.api
    	};
    };
})
.config(function($stateProvider, logviewerProvider) {
	
	// default routing
	$stateProvider
		.state("logviewer", {
			url: "/logviewer",
			templateUrl: "/view/logviewer.html",
			controller: "LogviewerCtrl"
		});
});
