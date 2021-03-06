const Sequelize = require('sequelize');

const Database = require('../PostgreSQL');

const database = new Database();

let UserProfile = database.db.define('userProfiles', {
	userID: Sequelize.STRING,
	inventory: {
		type: Sequelize.STRING,
		defaultValue: '[]'
	},
	money: {
		type: Sequelize.BIGINT(), // eslint-disable-line new-cap
		defaultValue: 0
	},
	balance: {
		type: Sequelize.BIGINT(), // eslint-disable-line new-cap
		defaultValue: 0
	},
	networth: {
		type: Sequelize.BIGINT(), // eslint-disable-line new-cap
		defaultValue: 0
	},
	experience: {
		type: Sequelize.BIGINT(), // eslint-disable-line new-cap
		defaultValue: 0
	},
	personalMessage: {
		type: Sequelize.STRING,
		defaultValue: ''
	},
	background: {
		type: Sequelize.STRING,
		defaultValue: 'default'
	},
	smashProfile: {
		type: Sequelize.JSON(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	infractions: {
		type: Sequelize.JSON(), // eslint-disable-line new-cap
		defaultValue: {}
	}
});

UserProfile.sync();

module.exports = UserProfile;
