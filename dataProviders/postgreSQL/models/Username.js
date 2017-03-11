const Sequelize = require('sequelize');

const Database = require('../PostgreSQL');

const database = new Database();

const Username = database.db.define('username', {
	userID: Sequelize.STRING,
	username: Sequelize.STRING
}, {
	indexes: [{ fields: ['userID'] }, {
		fields: ['userID', 'username'],
		unique: true
	}]
});

Username.sync();

module.exports = Username;
