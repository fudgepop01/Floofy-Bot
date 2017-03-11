const Sequelize = require('sequelize');

const Database = require('../PostgreSQL');

const database = new Database();

let GuildSettings = database.db.define('guildSettings', {
	guildID: Sequelize.STRING,
	customRep: Sequelize.STRING,
	customRepImage: Sequelize.STRING,
	customcommands: {
		type: Sequelize.JSONB(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	welcome: {
		type: Sequelize.JSONB(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	leave: {
		type: Sequelize.JSONB(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	rolestate: {
		type: Sequelize.JSONB(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	flairs: {
		type: Sequelize.JSONB(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	reactions: {
		type: Sequelize.JSONB(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	filter: {
		type: Sequelize.JSONB(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	logs: {
		type: Sequelize.JSONB(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	mentions: {
		type: Sequelize.JSONB(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	quiz: {
		type: Sequelize.JSONB(), // eslint-disable-line new-cap
		defaultValue: {}
	},
	nsfw: {
		type: Sequelize.JSONB(), // eslint-disable-line new-cap
		defaultValue: {}
	}
}, {
	indexes: [
		{
			unique: true,
			fields: ['guildID']
		}
	]
});

GuildSettings.sync();

module.exports = GuildSettings;
