angular.module("smart.logviewer.filters", [])
.filter('reverse', function() {
  	return function(items) {
    	if (!items) return items;
    	return items.slice().reverse();
    };
})
.filter('filterMessage', function() {
  	return function(items, search) {
    	if (!items || !search || search.trim() === "") return items;
    	var regex = new RegExp(search, "i");
    	var out = [];
    	items.forEach(function(item) {
    	   	if(regex.test(item.message)) out.push(item);
    	});
    	return out;
    };
})
.filter("highlightText", function($sce) {
	return function(text, search) {
		if (!search || search.trim() === "" || !text || text.trim() === "") {
        	return $sce.trustAsHtml("<span>" + text + "</span>");
        }	
		return $sce.trustAsHtml(text.replace(new RegExp(search, "gi"), '<span class="text-highlight">$&</span>'));
	};
});