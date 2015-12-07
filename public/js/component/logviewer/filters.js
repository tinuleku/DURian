angular.module("smart.logviewer.filters", [])
.filter('reverse', function() {
  	return function(items) {
    	return items.slice().reverse();
    };
});