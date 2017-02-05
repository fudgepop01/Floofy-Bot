const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const moment = require('moment');

module.exports = class UserInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'info',
			aliases: ['user', 'user-info'],
			group: 'info',
			memberName: 'info',
			description: 'Get info on a user.',
			details: `Get detailed information on the specified user.`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'member',
					prompt: 'what user would you like to have information on?\n',
					type: 'member'
				}
			]
		});
	}

	async run(msg, args) {
		const member = args.member;
		const user = member.user;
		const embed = new Discord.RichEmbed();
		embed.setAuthor(`${user.username}#${user.discriminator} (${user.id})`, user.avatarURL);
		embed.setThumbnail(user.displayAvatarURL);
		embed.setFooter(this.client.user.username, this.client.user.avatarURL);
		embed.setTimestamp(new Date());
		embed.addField('❯ Account Creation', moment(user.createdAt).tz('America/Chicago').format('dddd, MMMM Do YYYY, h:mm:ss a zz'), true);
		embed.setColor(0x0d0d0d);
		// colour via user profile?
		embed.addField('❯ Joined Server At', moment(member.joinedAt).tz('America/Chicago').format('dddd, MMMM Do YYYY, h:mm:ss a zz'), true);
		embed.addField('❯ Status', member.presence.status, true);
		embed.addField('❯ Game', member.presence.game ? member.presence.game.name : 'N/A', true);
		embed.addField('❯ Nickname', member.nickname ? member.nickname : 'N/A', true);
		if (member.roles.size <= 15) {
			embed.addField('❯ Roles', member.roles.map(role => {
				if (role.name !== '@everyone') return role.name;
				return '';
			}).join(', ').substring(2), true);
		} else {
			embed.addField('❯ Roles', 'Too Many', true);
		}
		return msg.embed(embed);
	}
};
