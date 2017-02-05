const { Command } = require('discord.js-commando');
// const stripIndents = require('common-tags').stripIndents;
const moment = require('moment');
require('moment-duration-format');
let usage = require('usage');
const config = require('../../settings');

const humanLevels = {
	0: 'None',
	1: 'Low',
	2: 'Medium',
	3: '(╯°□°）╯︵ ┻━┻'
};

module.exports = class ServerInfoCommand extends Command {
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

	async run(message) {
		/*
		return msg.embed({
			color: 3447003,
			description: '**Commando Statistics**',
			fields: [
				{
					name: '❯ Uptime',
					value: moment.duration(this.client.uptime)
						.format('d[ days], h[ hours], m[ minutes, and ]s[ seconds]'),
					inline: true
				},
				{
					name: '❯ Memory usage',
					value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
					inline: true
				},
				{
					name: '❯ General Stats',
					value: stripIndents`
					• Guilds: ${this.client.guilds.size}
					• Channels: ${this.client.channels.size}
					• Users: ${this.client.guilds.map(guild => guild.memberCount).reduce((a, b) => a + b)}
					`,
					inline: true
				},
				{
					name: '❯ Version',
					value: `v${version}`,
					inline: true
				}
			],
			thumbnail: { url: this.client.user.avatarURL }
		});
	*/
		const Discord = require('discord.js');
		const bot = message.client;
		let embed = new Discord.RichEmbed();
		var pid = process.pid;
		usage.lookup(pid, (err, result) => {
			if (err) return console.error(err);
			embed.addField('❯ Creator', `${bot.users.get(config.owner).username}#${bot.users.get(config.owner).discriminator}`);
			embed.addField('❯ Co-Dev', `${bot.users.get('69910888961806336').username}#${bot.users.get('69910888961806336').discriminator}`, true);
			embed.addField('❯ CPU Usage', `${result.cpu.toFixed(2)}%`, true);
			// embed.addField('Memory Usage',m.toFixed(2)+'/512'+' MB RAM',true);
			embed.addField('❯ Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true);
			embed.addField('❯ Swap Size', `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`, true);
			embed.addField('❯ Bot Uptime', moment.duration(bot.uptime).format(' D [days], H [hrs], m [mins], s [secs]'), true);
			embed.addField('❯ Total Servers', bot.guilds.size, true);
			// embed.addField('Dependencies', dependencies);
			embed.addField('❯ Other Info', `Javascript (Node JS)\nHost: [Digital Ocean](https://m.do.co/c/e7b63d9e2f75)`, true);
			return message.channel.sendEmbed(embed);
		});
	}
};
