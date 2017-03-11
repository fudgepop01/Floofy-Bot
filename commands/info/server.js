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
		const online = this.client.emojis.get('212789758110334977');
		const robot = this.client.emojis.get('230100838549291009');

		const embed = new Discord.RichEmbed();
		embed.setColor(0x0d0d0d);
		embed.setAuthor(`${message.guild.name} (${message.guild.id})`, message.guild.iconURL);
		// embed.setThumbnail(message.guild.iconURL);
		embed.addField('❯ Created at', moment(message.guild.createdAt).tz('America/Chicago').format('dddd, MMMM Do YYYY, h:mm:ss a zz'), true);
		embed.addField('❯ Owner', `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator} (${message.guild.owner.id})`);
		embed.addField('❯ Channels', message.guild.channels.size, true);
		let guild = await message.guild.fetchMembers();
		let bots = `${guild.members.filter(member => member.user.bot).size}${robot}`;
		let onlinePeeps = `${guild.members.size} members\n${guild.members.filter(member => member.presence.status !== 'offline').size}${online}`;
		embed.addField('❯ Members', `${onlinePeeps} ${bots}`, true);
		if (message.guild.roles.size >= 10) embed.addField('❯ Roles', message.guild.roles.size, true);
		else embed.addField('❯ Roles', message.guild.roles.map(role => role).join(' '), true);
		embed.setFooter(this.client.user.username, this.client.user.avatarURL);
		embed.setTimestamp();
		return message.channel.sendEmbed(embed).catch(() => null);
	}
};
