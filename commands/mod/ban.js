const { Command } = require('discord.js-commando');

module.exports = class BanUserCommand extends Command {
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

	async run(msg, args) { // eslint-disable-line consistent-return
		const user = args.user;
		if (!this.client.hasPermission('BAN_MEMBERS')) return msg.reply('I do not have the `ban members` permission.');
		msg.say('Are you sure you want to ban this user?  (__Y__es or __N__o)')
			.then(() => {
				return msg.embed({
					author: {
						name: `${user.username}#${user.discriminator} (${user.id})`,
						icon_url: user.avatarURL // eslint-disable-line camelcase
					},
					fields: [
						{
							name: 'Reason',
							value: args.reason
						}
					],
					timestamp: new Date()
				}).then(() => {
					msg.channel.awaitMessages(response => ['yes', 'no', 'cancel'].includes(response.content), {
						max: 1,
						time: 30000
					})
					.then((co) => { // eslint-disable-line consistent-return
						if (['yes'].includes(co.first().content)) {
							return msg.guild.ban(user, 7)
								.then(() => msg.say(`${user.username}#${user.discriminator} was banned.`))
								.catch(error => msg.reply(`There was an error trying to ban:\n${error}`));
								// mod-log, do unique case #
						} else if (['no', 'cancel'].includes(co.first().content)) {
							return msg.say('Got it, I won\'t ban the user.');
						}
					})
					.catch(() => msg.say('Aborting ban, took longer than 30 seconds to reply.'));
				});
			});
	}
};
