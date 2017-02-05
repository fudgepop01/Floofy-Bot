const { Command } = require('discord.js-commando');

module.exports = class UserInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'removerole',
			aliases: ['rr', 'rrole'],
			group: 'mod',
			memberName: 'removerole',
			description: 'Removes a role from a user.',
			guildOnly: true,

			args: [
				{
					key: 'member',
					prompt: 'What user would you like to remove the role from??\n',
					type: 'member'
				},
				{
					key: 'role',
					prompt: 'What role would you like to remove from the user?\n',
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
		await args.member.removeRole(args.role.name);
		return message.reply(`I have removed ${args.role.name} from ${args.member.user.username}.`);
	}
};
