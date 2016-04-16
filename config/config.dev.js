var config = {
	
	winston: {
		collection: "log",
		db: "mongodb://localhost:27017/durian",
		capped: true,
		cappedSize: 5000000, // 5Mo
		includeIds: false,
		label: "durian"
	},
	mongodb: {
		uri: "mongodb://localhost:27017/durian",
	},
	port: 3004,
	secret: "mysecretpwd"
};

module.exports = config;