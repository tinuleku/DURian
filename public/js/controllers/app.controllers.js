angular.module("durian.controllers", [
	"durian.controllers.dashboard"
])
.controller("HomeCtrl", function() {
})
.controller("LoginCtrl", function(loginService, $scope, $stateParams, redirectionService, $auth, $location) {
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
		
		$auth.login($scope.form)
		.then(function() {
        	$location.path(redirectionService.getRedirection());
		})
        .catch(function(response) {
			var message = "An unexpected error occurred. Please try again in a short while";
			if (response && response.data) message = response.data.message; 
			$scope.alert = {
				type: "alert",
				message: data.message,
				timeout: 8000
			};
		});
	};
});