const { Command } = require('discord.js-commando');

module.exports = class UserInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'setrole',
			aliases: ['sr', 'srole'],
			group: 'mod',
			memberName: 'setrole',
			description: 'Gives a user a role.',
			guildOnly: true,

			args: [
				{
					key: 'member',
					prompt: 'What user would you like to give a role to?\n',
					type: 'member'
				},
				{
					key: 'role',
					prompt: 'What role would you like to give the user?\n',
					type: 'role'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS');
	}

	async run(message, args) {
		let botMember = await message.guild.fetchMember(message.client.user);
		if (!botMember.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return message.reply('I do not have the `manage roles` permission.');
		// let role = message.guild.roles.filter(r => r.name.toLowerCase() === args.role.toLowerCase()).first();
		await args.member.addRoles([args.role]);
		return message.reply(`I have added ${args.role.name} to ${args.member.user.username}.`);
	}
};
