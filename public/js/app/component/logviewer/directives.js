angular.module("smart.logviewer.directives", [])
.directive("smartScrollViewport", function($window, $timeout) {
	return {
        restrict: "A",
        scope: {
            api: "=",
            loadAbove: "=",
            loadBelow: "="
        },
        controller: function($scope, $element, $attrs) {
        	$scope.init = true; // init flag 
        	$scope.topThreshold = 0;
        	$scope.bottomThreshold = 10; // a bit of margin;
        	
        	// Init if needed
        	if (!$scope.api || !$scope.api.items) $scope.api = {
	        	items: []
        	};
        	
        	// Define 2 loading methods
        	$scope.loadTopItems = function() {
	        	if ($scope.loadAbove && !$scope.api.isLoading) {
	        		$scope.api.isLoading = true;
		        	$scope.loadAbove($scope.topItem, function(items) {
			        	if (!items || items.length === 0) {
				        	$scope.api.topLoaded = true;
			        	}
			        	else {
			        		$scope.api.items = items.concat($scope.api.items);
			        		$scope.topItem = items[0];
			        		$scope.api.topLoaded = false;
			        	}
			        	$scope.api.isLoading = false;
		        	});
		        }
        	};
        	
        	$scope.loadBottomItems = function() {
	        	if ($scope.loadBelow) {
		        	$scope.api.isLoading = true;
		        	$scope.loadBelow($scope.bottomItem, function(items) {
			        	if (!items || items.length === 0) {
				        	$scope.api.bottomLoaded = true;
			        	}
			        	else {
			        		// Set the top item id not defined previously
			        		if (!$scope.topItem) $scope.topItem = items[0];
			        		$scope.api.items = $scope.api.items.concat(items);
			        		$scope.bottomItem = items[items.length - 1];
			        		$scope.api.bottomLoaded = false;
			        	}
			        	$scope.api.isLoading = false;
		        	});
		        }
        	};
        	
        	// Init items
	        $scope.loadTopItems();
	        $scope.loadBottomItems();
        },
        link: function($scope, $element, $attrs) {
		    // Get the viewport height
		    $scope.api.height = $element.prop('offsetHeight');
		    
		    console.log($element.find("div")[0].getBoundingClientRect());
		    
		    var debounceOngoing = false;
		    // scroll mode
		    var MANUAL = "manual";
		    var PONCTUAL = "ponctual";
		    var scrollMode;
		    $element.bind("scroll", function() {
	             $scope.scrollTop = this.scrollTop;
	             var comparePosition = function(value) {
		             return function() {
		             	debounceOngoing = false;
		             	if (value == $scope.scrollTop) {
		             		// the scroll has't changed
		             		// Ponctual scrolling
		             		if (scrollMode === MANUAL) {
			             		console.log("end of manual scroll to " + $scope.scrollTop);
		             		}
		             		else {
			             		onPonctualScrolling();
		             		}
		             		scrollMode = PONCTUAL;
		             	}
		             	else {
			             	scrollMode = MANUAL;
			             	if (value > $scope.scrollTop) {
			             		console.log("manual scroll up to " + $scope.scrollTop);
			             	}
			             	else {
				             	console.log("manual scroll down to " + $scope.scrollTop);
			             	}
		             	}
		             };
	             };
	             
	             // Scroll detected
	             // Debounce effect
	             if (!debounceOngoing) {
	             	debounceOngoing = true;
	             	$timeout(comparePosition(this.scrollTop), 100);
	             }
	             if (this.scrollTop <= $scope.topThreshold && !$scope.api.topLoaded) {
		             console.log("load top items", this.scrollTop);
		             $scope.loadTopItems();
	             }
	        });
	        
	        // 
		    function onPonctualScrolling() {
			    console.log("ponctual scroll to " + $scope.scrollTop);
			    console.log($element.find("div")[0].getBoundingClientRect());
			    // in case of initial scroll
			    if ($scope.init) {
			    	$scope.topThreshold = 2*$element.prop('offsetHeight');
				    $scope.init = false;
			    }
		    }
	    }
    };
});