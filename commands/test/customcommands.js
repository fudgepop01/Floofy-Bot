const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');
const Redis = require('../../dataProviders/redis/Redis');
const redis = new Redis();

const path = require('path');
const jsonfile = require('jsonfile');

module.exports = class MigrateCustomCommandsScript extends Command {
	constructor(client) {
		super(client, {
			name: 'customcommands',
			group: 'test',
			memberName: 'customcommands',
			description: 'Only use this once!'
		});
	}

	hasPermission(msg) {
		return msg.author.id === this.client.options.owner;
	}

	async run(msg) {
		for (let guild of this.client.guilds) {
			let sconfig = jsonfile.readFileSync(path.join('..', '..', 'config', 'server', `${guild.id}.json`));
			let check = sconfig.customcommands;
			if (!check) continue;
			Object.keys(sconfig.customcommands).forEach(async commandName => {
				let settings = await guildSettings.findOne({ where: { guildID: guild.id } });
				if (!settings) settings = await guildSettings.create({ guildID: guild.id });
				let customcommands = settings.customcommands;

				let oldRes = sconfig.customcommands[commandName];
				let newResponse = '';
				for (let i = 0; i < oldRes.length; i++) {
					if (i % 2 === 0) newResponse += oldRes[i];
					else newResponse += `rand:\${${oldRes[i]}}`;
				}
				console.log(`converted \`["${oldRes.join('", "')}"]\` \n to \`${newResponse}\``);

				let fixedName = commandName.replace(/,/g, '').replace(/\s/g, '');

				customcommands[fixedName] = {};
				customcommands[fixedName].response = newResponse;
				settings.customcommands = customcommands;
				await redis.db.setAsync(`customcommand${msg.guild.id}${fixedName}`, newResponse).catch(console.error);
				await settings.save().catch(console.error);
			});
		}
	}
};
