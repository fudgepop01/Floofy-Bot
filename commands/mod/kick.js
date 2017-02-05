const { Command } = require('discord.js-commando');

module.exports = class KickUserCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kick',
			aliases: ['k'],
			group: 'mod',
			memberName: 'kick',
			description: 'Kick a user from the server.',
			guildOnly: true,

			args: [
				{
					key: 'member',
					prompt: 'What user would you like to kick?\n',
					type: 'member'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('KICK_MEMBERS');
	}

	async run(msg, args) {
		const member = args.member;
		if (!this.client.hasPermission('KICK_MEMBERS')) return msg.reply('I do not have the `kick members` permission.');
		return member.kick()
			.then(() => msg.say(`${args.member.user.username}#${args.member.user.discriminator} was kicked.`))
			.catch(error => msg.reply(`There was an error trying to kick: ${error}`));
	}
	// go to mod logs
};
