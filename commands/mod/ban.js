const { Command } = require('discord.js-commando');

module.exports = class UserInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ban',
			aliases: ['b', 'banne', 'b&'],
			group: 'mod',
			memberName: 'ban',
			description: 'Permanently ban a user from the server.',
			guildOnly: true,

			args: [
				{
					key: 'user',
					prompt: 'What user would you like to ban?\n',
					type: 'user'
				},
				{
					key: 'reason',
					prompt: 'Please provide a reason for banning this user.\n',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('BAN_MEMBERS');
	}

	async run(message, args) {
		let botMember = await message.guild.fetchMember(message.client.user);
		if (!botMember.hasPermission('BAN_MEMBERS')) return message.reply('I do not have the `ban members` permission.');
		let user = args.user;
		message.channel.sendMessage('Are you sure you want to ban this user?  (__Y__es or __N__o)')
		.then(() => {
			return message.embed({
				author: {
					name: `${user.username}#${user.discriminator} (${user.id})`,
					icon_url: user.avatarURL
				},
				fields: [
					{
						name: 'Reason',
						value: args.reason
					}
				],
				timestamp: new Date()
			}).then(() => {
				message.channel.awaitMessages(response => ['yes', 'no', 'cancel'].includes(response.content), {
					max: 1,
					time: 30000
				})
				.then((c) => {
					if (['yes'].includes(c.first().content)) {
						return message.guild.ban(user, 7)
						.then(() => message.channel.send(`${user.username}#${user.discriminator} was banned.`))
						.catch(e => message.reply(`There was an error trying to ban:\n${e}`));
						// mod-log, do unique case #
					}
					else if (['no', 'cancel'].includes(c.first().content)) { return message.channel.sendMessage('Got it, I won\'t ban the user.'); }
				})
				.catch(() => message.channel.sendMessage('Aborting ban, took longer than 30 seconds to reply.'));
			});
		});
	}
};
