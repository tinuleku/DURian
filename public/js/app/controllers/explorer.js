angular.module("durian.controllers.explorer", [])
.controller("DatabaseViewerCtrl", function(databaseService, $scope) {
	$scope.form = {
		selector: "",
		collection: ""
	};
	
	$scope.expended = false;
	
	var limit = 20;
	var width = 12;
	
	$scope.search = function() {
		if (!$scope.form.collection || $scope.form.collection.trim() === "") {
			return; // TODO error message
		}
		
		databaseService.getDocuments({
			collection: $scope.form.collection,
			selector: $scope.form.selector,
			limit: limit,
			count: true
		})
		.success(function(result) {
			delete $scope.selectedDocument;
			$scope.pagination = {
				pages: Math.ceil(result.count / limit),
				page: 0,
				width: width
			};
			$scope.result = result;
			$scope.result.collection = $scope.form.collection;
		});
	};
	
	$scope.update = function(page) {
		if (!$scope.form.collection || $scope.form.collection.trim() === "") {
			return; // TODO error message
		}
		
		databaseService.getDocuments({
			collection: $scope.form.collection,
			selector: $scope.form.selector,
			skip: page * limit,
			limit: limit
		})
		.success(function(result) {
			delete $scope.selectedDocument;
			$scope.result.documents = result.documents;
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
		collections.sort(function(a, b) {
			if (!a.name) return -1;
			if (!b.name) return 1;
			return a.name.localeCompare(b.name);
		});
		$scope.collections = collections;
	});
	
	//$scope.search();
});