var winston = require("winston");
var later = require("later");

var dico = {};

/**
 * Remove the outdated values
 */
var scan = function() {
	var keys = Object.keys(dico);
	keys.forEach(function(key) {
		if (dico[key] && dico[key].expiry < new Date()) {
			delete dico[key];
		}
	});
}

var scanSchedule = {schedules: [{s: [0]}]};
later.setInterval(scan, scanSchedule);

/**
 * params:
 *	@key
 *	@value
 *	@expiry
 *	@override
 */
exports.store = function(key, value, expiry, override) {
	if (!expiry) {
		return winston.error("Connection Manager | expiry must be set");
	}
	if (!dico[key] || override) {
		dico[key] = {
			key: key,
			value: value,
			expiry: expiry
		};
	}
}

/**
 * Get value associated to the given key
 * params:
 *	@key
 */
exports.get = function(key, next) {
	var item = dico[key];
	if (item) return next(null, item.value)
	// TODO handle storing in db as a backup of the ram
	return next(null, null);
}