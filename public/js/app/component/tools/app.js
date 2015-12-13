angular.module("smart.tools", [])
.factory("promiseFactory", function($q) {
	return {
    	decorate: function(promise) {
	    	promise.success = function(callback) {
		    	promise.then(callback);

		    	return promise;
		    };

		    promise.error = function(callback) {
			    promise.then(null, callback);

			    return promise;
			};
		},
		defer: function() {
			var deferred = $q.defer();

			this.decorate(deferred.promise);

			return deferred;
		},
		when: function(data) {
			var deferred = $q.when(data);
			
			this.decorate(deferred.promise);
			
			return deferred;
		}
	};
})
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