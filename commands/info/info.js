const { Command } = require('discord.js-commando');
const moment = require('moment');
const stripIndents = require('common-tags').stripIndents;

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

	async run(message, args) {
		let member = args.member;
		const user = member.user;
		let bot = message.client;
		const Discord = require('discord.js');
		const embed = new Discord.RichEmbed();
		embed.setAuthor(`${user.username}#${user.discriminator} (${user.id})`, user.avatarURL);
		embed.setThumbnail(user.displayAvatarURL);
		embed.setFooter(bot.user.username, bot.user.avatarURL);
		embed.setTimestamp(new Date());
		embed.addField('❯ Account Creation', moment(user.createdAt).tz('America/Chicago').format('dddd, MMMM Do YYYY, h:mm:ss a zz'), true);
		embed.setColor(0x0d0d0d);
			// TODO: colour via user profile?
		embed.addField('❯ Joined Server At', moment(member.joinedAt).tz('America/Chicago').format('dddd, MMMM Do YYYY, h:mm:ss a zz'), true);
		embed.addField('❯ Status', member.presence.status, true);
		embed.addField('❯ Game', member.presence.game ? member.presence.game.name : 'N/A', true);
		embed.addField('❯ Nickname', member.nickname ? member.nickname : 'N/A', true);
		if (member.roles.size <= 15) embed.addField('❯ Roles', member.roles.map(r => { if (r.name != '@everyone') return r.name; }).join(', ').substring(2), true);
		else embed.addField('❯ Roles', 'Too Many', true);
		message.channel.sendEmbed(embed);
		/*
		return msg.embed({
			color: 3447003,
			fields: [
				{
					name: '❯ Member Details',
					value: stripIndents`
						${member.nickname !== null ? ` • Nickname: ${member.nickname}` : '• No nickname'}
						• Roles: ${member.roles.map(roles => `\`${roles.name}\``).join(' ')}
						• Joined at: ${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss ZZ')}
					`
				},
				{
					name: '❯ User Details',
					value: stripIndents`
						• Created at: ${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss ZZ')}${user.bot
							? '\n• Is a bot account'
							: ''}
						• Status: ${user.presence.status}
						• Game: ${user.presence.game ? user.presence.game.name : 'None'}
					`
				}
			],
			thumbnail: { url: user.avatarURL }
		});
		*/
	}
};
