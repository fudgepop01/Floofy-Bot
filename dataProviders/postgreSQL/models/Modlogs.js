const Sequelize = require('sequelize');

const Database = require('../PostgreSQL');

const database = new Database();

let Modlogs = database.db.define('modlogs', {
	guildID: Sequelize.STRING,
	channelID: Sequelize.STRING,
	caseCount: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	warning: {
		type: Sequelize.STRING, // eslint-disable-line new-cap
		defaultValue: '[]'
	},
	mute: {
		type: Sequelize.STRING, // eslint-disable-line new-cap
		defaultValue: '[]'
	},
	kick: {
		type: Sequelize.STRING, // eslint-disable-line new-cap
		defaultValue: '[]'
	},
	softban: {
		type: Sequelize.STRING, // eslint-disable-line new-cap
		defaultValue: '[]'
	},
	ban: {
		type: Sequelize.STRING, // eslint-disable-line new-cap
		defaultValue: '[]'
	}
});

Modlogs.sync({ force: true });

module.exports = Modlogs;
