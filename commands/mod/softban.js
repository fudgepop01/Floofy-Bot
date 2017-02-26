const { Command } = require('discord.js-commando');

module.exports = class BanUserCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'softban',
			group: 'mod',
			memberName: 'softban',
			description: 'Softbasn a user.',
			guildOnly: true,

			args: [
				{
					key: 'user',
					prompt: 'What user would you like to softban?\n',
					type: 'user'
				},
				{
					key: 'reason',
					prompt: 'Please provide a reason for softbanning this user.\n',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('KICK_MEMBERS');
	}

	async run(msg, args) {
		const user = args.user;
		if (!msg.channel.permissionsFor(this.client.user).hasPermission('BAN_MEMBERS')) return msg.reply('I do not have the `ban members` permission.');
		let success = await msg.guild.ban(user, 7).catch(null);
		if (!success) return msg.reply('There was an error trying to softban. (My role must be above the target user\'s highest role)');
		await msg.guild.unban(user);
		// do modlog stuff
		return msg.reply(`${args.user.username}#${args.user.discriminator} was softbanned.`);
	};
}
