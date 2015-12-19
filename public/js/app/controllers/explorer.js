angular.module("durian.controllers.explorer", [])
.controller("DatabaseViewerCtrl", function(databaseService, $scope) {
	$scope.form = {
		selector: "",
		collection: "log",
	};
	
	$scope.expended = false;
	
	$scope.search = function() {
		
		databaseService.getDocuments({
			collection: $scope.form.collection,
			selector: $scope.form.selector,
			limit: 20,
			count: true
		})
		.success(function(result) {
			delete $scope.selectedDocument;
			$scope.result = result;
			$scope.result.collection = $scope.form.collection;
		});
	};
	
	$scope.selectDocument = function(document) {
		$scope.selectedDocument = document;
	};
	
	$scope.toggleSidebar = function() {
		$scope.expended = !$scope.expended;
	};
	
	// get the list of collections
	databaseService.getCollections()
	.success(function(collections) {
		$scope.collections = collections;
	});
	
	//$scope.search();
});