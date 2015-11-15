angular.module("durian", ["smart.logviewer"])
.config(function(logviewerProvider){
    logviewerProvider.api = "/api/logs";
})
.controller("Ctrl", function() {});