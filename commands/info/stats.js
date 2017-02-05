const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const moment = require('moment');
require('moment-duration-format');
const usage = require('usage');
const config = require('../../settings');

module.exports = class StatsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stats',
			group: 'info',
			memberName: 'stats',
			description: 'Get info about the bot.',
			details: `Provides some information about the bot such as uptime and server count.`,
			guildOnly: false
		});
	}

	async run(msg) {
		const embed = new Discord.RichEmbed();
		const pid = process.pid;
		usage.lookup(pid, (err, result) => {
			if (err) return console.error(err);
			embed.addField('❯ Creator', `${this.client.users.get(config.owner).username}#${this.client.users.get(config.owner).discriminator}`);
			embed.addField('❯ Co-Dev', `${this.client.users.get('69910888961806336').username}#${this.client.users.get('69910888961806336').discriminator}`, true);
			embed.addField('❯ CPU Usage', `${result.cpu.toFixed(2)}%`, true);
			// embed.addField('Memory Usage',m.toFixed(2)+'/512'+' MB RAM',true);
			embed.addField('❯ Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true);
			embed.addField('❯ Swap Size', `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`, true);
			embed.addField('❯ Bot Uptime', moment.duration(this.client.uptime).format(' D [days], H [hrs], m [mins], s [secs]'), true);
			embed.addField('❯ Total Servers', this.client.guilds.size, true);
			// embed.addField('Dependencies', dependencies);
			embed.addField('❯ Other Info', `Javascript (Node JS)\nHost: [Digital Ocean](https://m.do.co/c/e7b63d9e2f75)`, true);
			return msg.embed(embed);
		});
	}
};
