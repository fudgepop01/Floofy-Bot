const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');
const Redis = require('../../dataProviders/redis/Redis');
const redis = new Redis();

const path = require('path');
const fs = require('fs');

function convertCommand(oldRes) {
	return new Promise(async resolve => {
		let newResponse = '';
		for (let i = 0; i < oldRes.length; i++) {
			if (i % 2 === 0) newResponse += oldRes[i];
			else newResponse += `\$rand:{${oldRes[i]}}`;
		}
		// console.log(`converted \`["${oldRes.join('", "')}"]\` \n to \`${newResponse}\``);
		resolve(newResponse);
	});
}

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

	async run() {
		let ids = [];
		for (let [, guild] of this.client.guilds) {
			(async function(guild) {
				let dir = path.join(__dirname, '..', '..', 'config', 'server', `${guild.id}.json`);
				let exists = fs.existsSync(dir);
				console.log(`guild:${guild} exists:${exists}`);
				if (!exists) return;

				let sconfig = fs.readFileSync(dir);
				if (!sconfig) console.log(sconfig);
				if (sconfig) sconfig = JSON.parse(sconfig);
				else return;
				if (!sconfig.customcommands) return;

				let commands = Object.keys(sconfig.customcommands);
				let numProcess = 0;

				let settings = await guildSettings.findOne({ where: { guildID: guild.id } }) || await guildSettings.create({ guildID: guild.id });
				let clon = settings.customcommands;

				async function process(cmd) {
					try {
						let oldJson = sconfig.customcommands[cmd],
							newRes = await convertCommand(oldJson.response),
							fixedName = cmd.replace(/,/g, '').replace(/\s/g, '');

						clon[fixedName] = {};
						clon[fixedName].response = newRes;

						await redis.db.setAsync(`customcommand${guild.id}${fixedName}`, newRes).catch(console.error);
					} catch (err) {
						console.error(err);
					} finally {
						if (numProcess++ >= commands.length - 1) {
							console.log(`clon:${JSON.stringify(clon, null, 4)}`);
							settings.customcommands = clon;
							settings.save().catch(console.error);
							console.log('done!');
						}
					}
				}

				commands.forEach(process);
			})(guild);
		}
	}
};
