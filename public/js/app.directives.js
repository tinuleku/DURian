angular.module("durian.directives", [])
.directive("foundationAlert", function() {
	return {
        restrict: 'E',
        transclude: true,
        scope: {
            alert: "="
        },
        require: 'ngModel',
        controller: function($scope, $timeout) {
            
            console.log("caca");
            $scope.$watch(function() {
	            return $scope.alert;
            }, function() {
	            $scope.visible = !!$scope.alert;
	            if ($scope.visible && $scope.alert.timeout) {
		            $timeout($scope.close, $scope.alert.timeout);
	            }
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
});