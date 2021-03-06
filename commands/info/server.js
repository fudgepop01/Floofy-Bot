const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const moment = require('moment-timezone');

module.exports = class ServerInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'server',
			aliases: ['server-info'],
			group: 'info',
			memberName: 'server',
			description: 'Get info on the server.',
			details: `Get detailed information on the server.`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	async run(message) {
		const embed = new Discord.RichEmbed();
		embed.setColor(0x0d0d0d);
		embed.setAuthor(`${message.guild.name} (${message.guild.id})`, message.guild.iconURL);
		// embed.setThumbnail(message.guild.iconURL);
		embed.addField('❯ Created at', moment(message.guild.createdAt).tz('America/Chicago').format('dddd, MMMM Do YYYY, h:mm:ss a zz'), true);
		embed.addField('❯ Owner', `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator} (${message.guild.owner.id})`, true);
		embed.addField('❯ Channels', message.guild.channels.size, true);
		if (message.guild.roles.size >= 15) embed.addField('❯ Roles', message.guild.roles.size, true);
		else embed.addField('❯ Roles', message.guild.roles.map(c => { if (c.name !== '@everyone') return c.name; }).join(', ').substring(2), true);
		embed.addField('❯ Emojis', message.guild.emojis.map(c => c).join(' '), true);
		embed.setFooter(this.client.user.username, this.client.user.avatarURL);
		embed.setTimestamp();
		let g = await message.guild.fetchMembers();
		let online = g.members.filter(m => m.presence.status !== 'offline').size;
		let bots = g.members.filter(m => m.user.bot).size;
		embed.addField('❯ Members', `${g.members.size} members\n${online} online \uD83D\uDD35, ${bots} bot(s) \uD83E\uDD16`, true);
		return message.channel.sendEmbed(embed);
	}
};
