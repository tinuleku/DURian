angular.module("smart.urlBuilder", [])
.factory("urlBuilder", function() {
	return function(root, options) {
		if (!options) return root;
		var url = root;
		var separator = '';
		Object.keys(options).forEach(function(key) {
			if (options[key] !== null && options[key] !== undefined) {
				url += separator + key + "=" + options[key];
				separator = '&';
			}
		});
		return url;
	};
});