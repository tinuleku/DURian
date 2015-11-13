var config = {
	
	winston: {
		collection: "log",
		db: "mongodb://localhost:27017/durian",
		capped: true,
		cappedSize: 5000000, // 5Mo
		includeIds: false
	},
	mongodb: {
		uri: "mongodb://localhost:27017/durian",
	},
	port: 3004
};

module.exports = config;