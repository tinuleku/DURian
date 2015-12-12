angular.module("smart.logviewer", [
	"ui.router",
	"angularMoment",
	"luegg.directives",
	"smart.tools",
	"smart.logviewer.controllers", 
	"smart.logviewer.services",
	"smart.logviewer.factories",
	"smart.logviewer.filters"
])
.provider("logviewer", function() {
	this.api = "/logs";
	
	this.$get = function () {
    	return {
	    	api: this.api
    	};
    };
})
.config(function($stateProvider) {
	
	// default routing
	$stateProvider
		.state("logviewer", {
			url: "/logviewer",
			templateUrl: "/view/logviewer.html",
			controller: "LogviewerCtrl"
		});
});
