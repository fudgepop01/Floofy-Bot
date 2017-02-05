// https://scotch.io/tutorials/better-javascript-with-es6-pt-ii-a-deep-dive-into-classes
// https://github.com/WeebDev/Commando/blob/master/postgreSQL/SequelizeProvider.js
// https://github.com/appellation/pleb/blob/master/src/util/providers/GuildSettings.js

class GuildSettings {
	constructor(thonk, guild) {
		this.database = thonk;
		this.guild = guild;
		this._table = this.database.r.table('guilds');
	}

	get(guild) {
		if (guild.constructor.name === 'Guild') guild = guild.id;
		return this._table.get(guild).run().catch(console.error);
	}

	set(key, value) {
		return this._table.update({ [key]: value }, { returnChanges: 'always' }).run()
		.then(() => {
			this.cacheGuildConf();
		});
	}

	newGuildConf() {
		return this._table.insert({
			id: this.guild.id,
			name: this.guild.name
		}, { returnChanges: 'always' }).run().then(() => {
			return this._table.get(this.guild.id).run();
		});
		// insert doesnt return changes by default
	}

	cacheGuildConf() {
		return this._table.get(this.guild.id).run().then(res => {
			this.set(this.guild.id, res);
		});
	}

}

module.exports = GuildSettings;
