const { Command } = require('discord.js-commando');

module.exports = class UserInfoCommand extends Command {
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

	async run(message, args) {
		let botMember = await message.guild.fetchMember(message.client.user);
		if (!botMember.hasPermission('KICK_MEMBERS')) return message.reply('I do not have the `kick members` permission.');
		args.member.kick()
    .then(() => message.channel.send(`${args.member.user.username}#${args.member.user.discriminator} was kicked.`))
    .catch(e => message.reply(`There was an error trying to kick: ${e}`));
	}
	// go to mod logs
};
