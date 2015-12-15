describe("directive : foundationAlert", function() {
	
	var $compile, $scope, element;
	
	function removeComments(content) {
		return content.replace(/<!--.*?-->/g, "");
	};
	
	function getCompiledElement(){
	  	var element = angular.element('<foundation-alert alert="alert"></foundation-alert>');
	  	var compiledElement = $compile(element)($scope);
	  	$scope.$digest();
	  	return compiledElement;
	};
	
	beforeEach(function() {
		module("durian.directives");
		
		inject(function(_$compile_, _$rootScope_, _$timeout_) {
			$compile = _$compile_;
			$scope = _$rootScope_.$new();
			$timeout = _$timeout_;
		});
		
		element = getCompiledElement();
	});
	
	it("empty alert", function() {
		delete $scope.alert;
		$scope.$digest();
		expect(removeComments(element.html())).toEqual("");
	});
	
	it("simple valid alert", function() {
		$scope.alert = {
			type: "info",
			message: "my message"
		};
		$scope.$digest();
		// change the parent scope
		var isolateScope = element.isolateScope();
		
		expect(isolateScope.alert).toEqual({
			type: "info",
			message: "my message"
		});
		expect(element.find("div").hasClass("info")).toBe(true);
		expect(element.text()).toEqual("my message");
	});
	
	it("valid alert with timeout", function() {
		$scope.alert = {
			type: "info",
			message: "my message",
			timeout: 10
		};
		$scope.$digest();
		// change the parent scope
		expect(element.text()).toEqual("my message");
		
		// before the end of the delay
		$timeout.flush(9);
		expect(element.text()).toEqual("my message");
		
		// after the end of the delay
		$timeout.flush(2);
		expect(element.text()).toEqual("");
		expect(removeComments(element.html())).toEqual("");
	});
});