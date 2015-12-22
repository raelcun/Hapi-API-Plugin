module.exports = {
	constructMongoURI: function(username, password, hostname, port, database) {
		return "mongodb://" + username + ":" + password + "@" + hostname + ":" + port + "/" + database;
	}
};