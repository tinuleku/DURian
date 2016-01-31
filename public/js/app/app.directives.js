angular.module("durian.directives", [])
.directive("foundationAlert", function() {
	return {
        restrict: 'E',
        transclude: true,
        scope: {
            alert: "="
        },
        controller: function($scope, $timeout) {
            
            function displayAlert() {
	            $scope.visible = !!$scope.alert;
	            if ($scope.visible && $scope.alert.timeout) {
		            $timeout($scope.close, $scope.alert.timeout);
	            }
            }
            
            //displayAlert();
            
            $scope.$watch(function() {
	            return $scope.alert;
            }, function() {
	            $scope.changed = true;
	            displayAlert();
            });
            
            $scope.close = function() {
	            delete $scope.alert;
	            $scope.visible = false;
            };
            
        },
        template: '<div data-alert class="alert-box radius" ng-class="alert.type" ng-if="visible">'
                    + '{{alert.message}}'
                    + '</div>'
    };
})
.directive("foundationPagination", function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			page: "=",
			pages: "=",
			width: "=",
			update: "=",
		},
		link: function($scope) {
			
			var center_range = 2;
			var border_range = 2;
			// to be computed based on the given width
			var total_range = 2*center_range + 2*border_range + 3;
			var first_range;
			var second_range;
			$scope.indexes = [];
				
			var update_page = function(page) {
				$scope.page = page;
				if ($scope.pages > total_range) {
					$scope.indexes = [];
					if ($scope.page < center_range + border_range + 2) {
						for (i = 0; i < border_range + 2*center_range + 2; i++) {
							$scope.indexes.push({
								i : i
							});
						}
						$scope.indexes.push({
							i : '..',
							Nan: true
						});
						for (i = $scope.pages - border_range; i < $scope.pages; i++) {
							$scope.indexes.push({
								i : i
							});
						}
					} else if ($scope.page > $scope.pages - center_range - border_range - 2) {
						for (i = 0; i < border_range; i++) {
							$scope.indexes.push({
								i : i
							});
						}
						$scope.indexes.push({
							i : '..',
							Nan: true
						});
						for (i = $scope.pages - 2*center_range - border_range - 2; i < $scope.pages; i++) {
							$scope.indexes.push({
								i : i
							});
						}
					} else {
						for (i = 0; i < border_range; i++) {
							$scope.indexes.push({
								i : i
							});
						}
						$scope.indexes.push({
							i : '..',
							Nan: true
						});
						for (i = $scope.page - center_range; i < $scope.page + center_range + 1; i++) {
							$scope.indexes.push({
								i : i
							});
						}
						$scope.indexes.push({
							i : '..',
							Nan: true
						});
						for (i = $scope.pages - border_range; i < $scope.pages; i++) {
							$scope.indexes.push({
								i : i
							});
						}	
					}		
				}
				else {
					$scope.indexes = [];
					for (i = 0; i < $scope.pages; i++) {
						$scope.indexes.push({
							i : i
						});
					}
				}
			};
			
			var update_range = function() {
				if ($scope.width) {
					border_range = Math.min(Math.floor(($scope.width - 3) / 4), 3);
					center_range = Math.floor(($scope.width - 3 - 2*border_range)/2);
					total_range = 2*center_range + 2*border_range + 3;
				}
			};
			
			// go to the next page
			$scope.next = function(e) {
				e.preventDefault();
				if ($scope.page < $scope.pages - 1) {
					$scope.page++;
					$scope.update($scope.page);
					update_page($scope.page);
				}
			};
			
			// go to the next page
			$scope.previous = function(e) {
				e.preventDefault();
				if ($scope.page > 0) {
					$scope.page -= 1;
					$scope.update($scope.page);
					update_page($scope.page);
				}
			};
			
			// go to the next page
			$scope.to = function(page, e) {
				e.preventDefault();
				$scope.page = page;
				$scope.update($scope.page);
				update_page(page);
			};
			
			$scope.goTo = function(new_page) {
				$scope.page = new_page - 1;
				$scope.update($scope.page);
				update_page($scope.page);
			};
			
			// Bind pages
			$scope.$watch('pages', function(value) {
				update_page($scope.page);
			});
			
			// Bind page
			$scope.$watch('page', function(value) {
				update_page(value);
			});
			
			// Bind width
			$scope.$watch('width', function(value) {
				update_range();
				update_page($scope.page);
			});
			
			update_range();
			update_page($scope.page);
		},
		template: '<div ng-if="pages > 1" class="pagination-centered">'
			+ 	'<ul class="pagination">'
			+ 		'<li class="arrow" ng-class="{unavailable: page == 0}"><a href ng-click="previous($event)">&laquo;</a></li>'
			+		'<li ng-repeat="index in indexes" ng-class="{unavailable : index.Nan, current : index.i == page}">'
			+			'<a href ng-click="to(index.i, $event)" ng-if="!index.Nan">{{index.i + 1}}</a>'
			+			'<a href ng-if="index.Nan">&hellip;</a>' 
			+		'</li>'
			+		'<li class="arrow" ng-class="{unavailable: page == pages - 1}"><a href ng-click="next($event)">&raquo;</a></li>'
			+ 	'</ul>'
			+'</div>'
	};
})
.directive("ngEnter", function() {
	return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                });
                event.preventDefault();
            }
        });
    };  
});