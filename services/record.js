var winston = require("winston");

var Record = require("../models/records.js");

/**
 * Get user records
 */
exports.getUserRecords = function(userId, options, next) {
	winston.info("SvcRecord | Get records for user " + userId);
	Record.find({author: userId}, function(err, records) {
		if (err) {
			winston.error("SvcRecord | error when getting records for user " + userId + " : " + err);
			return next({status: 500, message: "internal server error"});
		}
		return next({status: 200, records: records});
	});
};


/**
 * Create record
 */
exports.createRecord = function(selector, userId, next) {
	winston.info("SvcRecord | Create new record for user " + userId);
	// TODO check against the selector
	var record = new Record({
		user: userId,
		selector: selector,
		status: "draft"
	});
	record.save(function(err, savedRecord) {
		if (err) {
			winston.error("SvcRecord | error when creating record for user " + userId + " : " + err);
			return next({status: 500, message: "internal server error"});
		}
		return next({status: 200, record: savedRecord, message: "Record successfully created"});
	});
};

/**
 * Set the update of the record
 */
exports.setRecordUpdate = function(update, recordId, next) {
	winston.info("SvcRecord | Set update for record " + recordId);
	// TODO check against the update
	Record.update({_id: recordId}, {
		$set: {
			update: update
		}
	}, function(err) {
		if (err) {
			winston.error("SvcRecord | error when setting update for record " + recordId + " : " + err);
			return next({status: 500, message: "internal server error"});
		}
		return next({status: 200, message: "Record update set successfully"});
	});
};