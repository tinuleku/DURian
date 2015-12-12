angular.module("durian.controllers.dashboard", [])
.controller("DashboardCtrl", function(userService) {
	
	userService.getUserId()
	.success(function(userId) {
		
		// Get user details
		userService.getUser(userId)
		.success(function(user) {
			$scope.user = user;
		});
		
		// Get user records
		userService.getUserRecords(userId)
		.success(function(records) {
			$scope.records = records;
		});
	});
});