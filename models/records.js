var mongoose = require('mongoose');

var RecordSchema = new mongoose.Schema({
	author: mongoose.Schema.Types.ObjectId,
	
	selector: mongoose.Schema.Types.Mixed,
	documents: {
		updated: [mongoose.Schema.Types.Mixed],
		previous: [mongoose.Schema.Types.Mixed]
	},
	
	datetime: Date,
	status: {
		type: String,
		enum: ["ongoing", "completed", "reverted"]
	}
});

module.exports = mongoose.model('Record', RecordSchema, 'record');