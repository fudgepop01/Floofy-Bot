const Sequelize = require('sequelize');

const Database = require('../PostgreSQL');

const database = new Database();

let GuildSettings = database.db.define('guildSettings', {
	guildID: Sequelize.STRING,
	customcommands: {
		type: Sequelize.JSON(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	welcome: {
		type: Sequelize.JSON(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	leave: {
		type: Sequelize.JSON(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	rolestate: {
		type: Sequelize.JSON(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	cases: {
		type: Sequelize.JSON(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	flairs: {
		type: Sequelize.JSON(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	reactions: {
		type: Sequelize.JSON(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	infractions: {
		type: Sequelize.JSON(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	filter: {
		type: Sequelize.JSON(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	logs: {
		type: Sequelize.JSON(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	nsfw: {
		type: Sequelize.JSON(), // eslint-disable-line new-cap
		defaultValue: {}
	}
});

GuildSettings.sync();

module.exports = GuildSettings;
