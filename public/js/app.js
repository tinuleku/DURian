angular.module("durian", [
	"ui.router",
	"smart.logviewer",
	"smart.urlBuilder"
])
.config(function($stateProvider, logviewerProvider){
    logviewerProvider.api = "/api/logs";
    
    // default routing
	$stateProvider
		.state("login", {
			url: "/login",
			templateUrl: "/view/login.html",
			controller: "LoginCtrl"
		});
})
.controller("Ctrl", function() {})
.controller("LoginCtrl", function($scope, $stateParams) {
	$scope.databasesOption = [{
		name: "MongoDB"
	}, {
		name: "CouchBase"
	}, {
		name: "Mysql"
	}, {
		name: "Oracle"
	}];
	
	$scope.form = {};
	
	$scope.selectDatabase = function(database) {
		if ($scope.selectedDatabase) {
			$scope.selectedDatabase.selected = false;
		}
		database.selected = true;
		$scope.selectedDatabase = database;
	};
	
	$scope.select = function() {
		if ($scope.selectedDatabase) {
			$scope.form.database = $scope.selectedDatabase.name;
		}
	};
	
	$scope.unselect = function() {
		delete $scope.form.database;
	};
	
	// TODO remove
	console.log($stateParams);
	if ($stateParams.dbType) {
		console.log("db type set", $stateParams.dbType);
	}
});