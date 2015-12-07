angular.module("durian.controllers", [])
.controller("HomeCtrl", function() {
})
.controller("LoginCtrl", function(loginService, $scope, $stateParams) {
	$scope.databasesOption = [{
		name: "MongoDB",
		type: "mongodb",
		image: "/img/mongodb.png"
	}, {
		name: "CouchBase",
		image: "/img/couchbase.png"
	}, {
		name: "Mysql",
		type: "mysql",
		image: "/img/mysql.png"
	}, {
		name: "Oracle",
		image: "/img/oracle.png"
	}];
	
	$scope.form = {
		database: "",
		username: "",
		password: ""
	};
	
	$scope.selectDatabase = function(database) {
		$scope.selectedDatabase = database;
		database.selected = true;
		$scope.form.databaseType = database.type;
	};
	
	$scope.unselect = function() {
		$scope.selectedDatabase.selected = false;
		delete $scope.form.databaseType;
	};
	
	$scope.login = function() {
		console.log($scope.form);
		// checkForm
		if (!$scope.form.database) {
			$scope.alert = {
				type: "warning",
				message: "Database URL is missing",
				timeout: 5000
			};
			return;
		}
		
		// processing message
		$scope.alert = {
			type: "info",
			message: "Credentials sent ..."
		};
		
		loginService.login($scope.form)
		.success(function(data) {
			// redirection to the home page or the stored page
			
		})
		.error(function(data) {
			$scope.alert = {
				type: "alert",
				message: data.message,
				timeout: 8000
			};
		});
	};
});