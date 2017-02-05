// const rethink = require('rethinkdbdash')({ host: '127.0.0.1', db: 'Config' });
/*
const rethink = require('rethinkdbdash')({
	servers: [
		{ host: 'localhost', port: 28015 },
		{ host: '192.168.0.101', port: 28015 },
		{ host: '192.168.0.102', port: 28015 }
	],
	buffer: 10,
	max: 5,
	db: 'Config'
});
*/
const rethink = require('rethinkdbdash')({ db: 'Config' });
const Settings = require('./rethonk');

class RethinkProvider {
	constructor(bot) {
		this.r = rethink;
		this.bot = bot;
	}
	initGuild(guild) {
		const setting = new Settings(this, guild);
		return setting.newGuildConf().then((res) => {
			this.bot.guildSettings.set(guild.id, res);
		}).catch(err => console.error(err));
	}
	initGuilds() {
		this.bot.guilds.forEach(guild => {
			this.initGuild(guild);
		});
	}
}

module.exports = RethinkProvider;
