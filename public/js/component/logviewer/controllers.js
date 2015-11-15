angular.module("smart.logviewer.controllers", [])
.controller("LogviewerCtrl", function(logService, $scope) {
	
	$scope.showLabel = false;
	
	logService.getLogs()
	.success(function(logs) {
		$scope.logs = logs;
		$scope.logs.forEach(function(log) {
			if (log.label) $scope.showLabel = true;
		});
	});
});