angular.module("smart.logviewer.controllers", [])
.controller("LogviewerCtrl", function(logService, $scope, $sce) {
	
	$scope.showLabel = false;
	
	$scope.form = {
		search: ""
	};
	
	function searchLogs() {
		logService.getLogs({
		})
		.success(function(logs) {
			$scope.logs = logs;
			$scope.logs.forEach(function(log) {
				if (log.label) $scope.showLabel = true;
			});
		});
	}
	
	searchLogs();
	
	var withRegex = false;
	$scope.search = function() {
		if (!withRegex) {
			$scope.textSearch = $scope.form.search.replace(/[\|\[\]\(\)\.\$\^\*]/g, "\\$&");
		}
		else {
			try {
				var regex = new RegExp($scope.form.search);
				$scope.textSearch = $scope.form.search;
			} catch(e) {
				console.log("Invalid expression");
				// error to report
			}
		}
	};
});