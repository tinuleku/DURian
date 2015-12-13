describe("directive : ngEnter", function() {
	
	var $scope, $compile, element;

	function getCompiledElement(){
	  	var element = angular.element('<input id="#test" ng-enter="enter()"/>');
	  	var compiledElement = $compile(element)($scope);
	  	$scope.$digest();
	  	return compiledElement;
	};
	
	beforeEach(function() {
		module("durian.directives");
		
		inject(function(_$compile_, _$rootScope_) {
			$compile = _$compile_;
			$scope = _$rootScope_.$new();
		});
		
		element = getCompiledElement();
	});
	
	it("press enter", function() {
		$scope.enter = function() {};
		spyOn($scope, "enter"); 
		
		element.triggerHandler({type: 'keydown', which: 13});
		
		expect($scope.enter).toHaveBeenCalled();
	});
	
	it("press a key different than enter", function() {
		$scope.enter = function() {};
		spyOn($scope, "enter"); 
		
		element.triggerHandler({type: 'keydown', which: 14});
		
		expect($scope.enter).not.toHaveBeenCalled();
	});
});