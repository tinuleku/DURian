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