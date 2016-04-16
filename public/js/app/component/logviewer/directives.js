angular.module("smart.logviewer.directives", [])
.directive("smartSearch", function() {
	return {
		restrict: "A",
		scope: {
			ngSubmit: "&",
			ngModel: "="
		},
		link: function($scope, $element, $attrs) {
			$scope.reset = function() {
				$scope.ngModel = "";
				$element[0].querySelector('input').focus();
			};
			
			$scope.search = function() {
				$scope.ngSubmit({});
			};
		},
		template: '<span class="icon icon-left"><i class="fa fa-search"></i></span>'
			+ '<input type="text" class="search-input" ng-model="ngModel" placeholder="Text search" ng-enter="search()">'
			+ '<span class="icon icon-right" ng-show="ngModel && ngModel != \'\'" ng-click="reset()"><i class="fa fa-times"></i></span>'
	};
})
.directive("smartScrollViewport", function($window, $timeout) {
	function ThresholdManager(viewHeight) {
		
		var contentHeight = 0;
		
		var minPosYThreshold = 2*viewHeight;
		var minPosYThresholdActive = true;
		
		var maxPosYThreshold = 0;
		var maxPosYThresholdActive = true;
		
		this.setContentHeight = function(height) {
			console.log("Threshold Manager | content height set to " + height);
			contentHeight = height;
			maxPosYThreshold = height - 2*viewHeight;
		};
		
		this.setViewHeight = function(height) {
			console.log("Threshold Manager | view height set to " + height);
			viewHeight = height;
			maxPosYThreshold = contentHeight - 2*height;
		};
		
		this.onPosYDecrease = function(posY, callback) {
			if (minPosYThresholdActive && posY < minPosYThreshold) {
				// Deactivate the min threshold
				minPosYThresholdActive = false;
				console.log("Threshold Manager | minThreshold reached, posY = " + posY + ", minPosYThreshold = " + minPosYThreshold);
				return callback();
			}
		};
		
		this.onPosYIncrease = function(posY, callback) {
			if (maxPosYThresholdActive && posY > maxPosYThreshold) {
				// Deactivate the min threshold
				maxPosYThresholdActive = false;
				console.log("Threshold Manager | maxThreshold reached, posY = " + posY + ", maxPosYThreshold = " + maxPosYThreshold);
				return callback();
			}
		};
		
		this.onTopContentLoaded = function(flag) {
			if (!flag) {
				minPosYThresholdActive = true;
			}
			else console.log("Threshold Manager | no more top content to be loaded");
		};
		
		this.onBottomContentLoaded = function(flag) {
			if (!flag) {
				maxPosYThresholdActive = true;
			}
			else console.log("Threshold Manager | no more bottom content to be loaded");
		};
	}
	
	function ContentManager() {
		
		var search = "";
		var items = [];
		var visibleItems = [];
		
		this.setSearch = function(newFilter) {
			if (search != newFilter) {
				search = newFilter;
				visibleItems = filterItems(items, search);
			}
		};
		
		this.setItems = function(newItems) {
			items = newItems;
			visibleItems = filterItems(newItems, search);
		};
		
		this.pushItems = function(newItems) {
			newVisibleItems = filterItems(newItems, search);
			items = items.concat(newItems);
			visibleItems = visibleItems.concat(newVisibleItems);
		};
		
		this.shiftItems = function(newItems) {
			newVisibleItems = filterItems(newItems, search);
			items = newItems.concat(items);
			console.log("Content Manager | " + newVisibleItems.length + " item(s) added to the top of the view");
			visibleItems = newVisibleItems.concat(visibleItems);
		};
		
		this.isFull = function() {
			return items.length > 200000;
		};
		
		this.getFirstItem = function() {
			return items[0];
		};
		
		this.getLastItem = function() {
			return items[items.length - 1];
		};
		
		this.getVisibleItems = function() {
			return visibleItems;
		};
		
		/**
		 * Compute the height of the items once displayed
		 * This relies on a display simulation
		 * Result in px
		 */
		this.getContentHeight = function(items) {
			return 21*items.length; // simplistic model, line height = 21px
		};
		
		function filterItems(items, search) {
	    	if (!items || !search || search.trim() === "") return items;
	    	var regex = new RegExp(search, "i");
	    	var out = [];
	    	items.forEach(function(item) {
	    	   	if(regex.test(item.message)) out.push(item);
	    	});
	    	return out;
	    }
	}
	
	return {
        restrict: "A",
        scope: {
            api: "=",
            loadAbove: "&",
            loadBelow: "&",
            search: "="
        },
        link: function($scope, $element, $attrs) {
		    
		    // Get the viewport height
		    var viewHeight = $element.prop('offsetHeight');
		    
		    $scope.thresholdManager = new ThresholdManager(viewHeight);
		    $scope.contentManager = new ContentManager();
		    
		    // Get the content height and posY
		    var clientRect = $element.find("div")[0].getBoundingClientRect();
		    var contentHeight = clientRect.height;
		    $scope.thresholdManager.setContentHeight(contentHeight);
		    
		    console.log(clientRect);
		    
		    // Listen to any search update
		    $scope.$watch(function() {
			    return $scope.search;
		    }, function() {
			    $scope.contentManager.setSearch($scope.search);
			    $timeout(function() {
				    var rect = $element.find("div")[0].getBoundingClientRect();
				    console.log(rect);
				    onPosYDecrease(-rect.top);
				    onPosYIncrease(-rect.top);
				}, 1);
		    });
		    
		    if (!$scope.api) $scope.api = {};
		    if (!$scope.api.items) $scope.api.items = [];
		    $scope.api.height = viewHeight;
		    $scope.contentManager.setItems($scope.api.items);
		    
		    // Listen to any items update
		    $scope.$watch(function() {
			    return $scope.contentManager.getVisibleItems();
		    }, function(items) {
			    $scope.api.items = items;
		    });
		    
		    function onPosYDecrease(posY) {
			    $scope.thresholdManager.onPosYDecrease(posY, function() {
				    if ($scope.loadAbove) {
						$scope.api.isLoading = true;
						return $scope.loadAbove({item: $scope.contentManager.getFirstItem(), callback: function(items) {
							$scope.api.isLoading = false;
							if (!items || items.length === 0) {
								$scope.api.topLoaded = true;
								return $scope.thresholdManager.onTopContentLoaded(true);
							}
							var height = $scope.contentManager.getContentHeight(items);
							$scope.contentManager.shiftItems(items);
							$timeout(function() {
								$element[0].scrollTop += height;
								
								var rect = $element.find("div")[0].getBoundingClientRect();
								$scope.thresholdManager.setContentHeight(rect.height);
								$scope.thresholdManager.setViewHeight($element.prop('offsetHeight'));
								// Release the threshold only if we can store more data
								if (!$scope.contentManager.isFull()) $scope.thresholdManager.onTopContentLoaded();
								else $scope.api.full = true;
								onPosYDecrease(-rect.top);
							}, 0);
						}});
					}
					else $scope.thresholdManager.onTopContentLoaded(true);
			    });
		    }
		    
		    function onPosYIncrease(posY) {
			    $scope.thresholdManager.onPosYIncrease(posY, function() {
				    if ($scope.loadBelow) {
						return $scope.loadBelow({item: $scope.contentManager.getLastItem(), callback: function(items) {
							if (!items || items.length === 0) {
								$scope.api.bottomLoaded = true;
								return $scope.thresholdManager.onBottomContentLoaded(true);
							}
							$scope.contentManager.pushItems(items);
							// Update view height and content height
							var rect = $element.find("div")[0].getBoundingClientRect();
							$scope.thresholdManager.setContentHeight(rect.height);
							$scope.thresholdManager.setViewHeight($element.prop('offsetHeight'));
							// Release the threshold only if we can store more data
							if (!$scope.contentManager.isFull()) $scope.thresholdManager.onBottomContentLoaded();
							else $scope.api.full = true;
							// Check if some data needed to be loaded again
							onPosYIncrease(-rect.top);
						}});
					}
					else $scope.thresholdManager.onBottomContentLoaded(true);
			    });
		    }
		    
		    // verify no new content need to be loaded
		    onPosYDecrease(-clientRect.top);
		    onPosYIncrease(-clientRect.top);
		    
		    var debounceOngoing = false;
		    // scroll mode
		    var MANUAL = "manual";
		    var PONCTUAL = "ponctual";
		    var scrollMode;
		    
		    var posY = -clientRect.top;
		    $element.bind("scroll", function() {
		    	var newPosY = this.scrollTop;
		    	
		    	if (posY > newPosY) {
					onPosYDecrease(newPosY);
				}
				else if (posY < newPosY) {
					onPosYIncrease(newPosY);
				}
				posY = newPosY;
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