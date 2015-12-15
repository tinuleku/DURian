angular.module("durian.controllers.explorer", [])
.controller("DatabaseViewerCtrl", function(databaseService, $scope) {
	$scope.form = {
		selector: "",
		collection: "log",
	};
	
	$scope.search = function() {
		
		databaseService.getDocuments({
			collection: $scope.form.collection,
			selector: $scope.form.selector,
			count: true
		})
		.success(function(result) {
			$scope.result = result;
			$scope.result.collection = $scope.form.collection;
		});
	};
	
	$scope.selectDocument = function(document) {
		$scope.selectedDocument = document;
	};
	
	// get the list of collections
	databaseService.getCollections()
	.success(function(collections) {
		$scope.collections = collections;
	});
	
	//$scope.search();
});