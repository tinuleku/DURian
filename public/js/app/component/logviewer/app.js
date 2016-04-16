angular.module("smart.logviewer", [
	"ui.router",
	"angularMoment",
	"luegg.directives",
	"smart.tools",
	"smart.logviewer.controllers", 
	"smart.logviewer.services",
	"smart.logviewer.factories",
	"smart.logviewer.filters",
	"smart.logviewer.directives"
])
.provider("logviewer", function() {
	this.api = "/logs";
	this.showLabel = true;
	
	this.$get = function () {
    	return {
	    	api: this.api,
	    	showLabel: this.showLabel
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
