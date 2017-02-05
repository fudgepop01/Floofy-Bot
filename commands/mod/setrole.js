const { Command } = require('discord.js-commando');

module.exports = class SetRoleCommand extends Command {
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

	async run(msg, args) {
		const member = args.member;
		const user = member.user;
		const role = args.role;
		if (!this.client.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return msg.reply('I do not have the `manage roles` permission.');
		// const role = msg.guild.roles.filter(ro => ro.name.toLowerCase() === role.toLowerCase()).first();
		await member.addRoles([role]);
		return msg.reply(`I have added ${role.name} to ${user.username}.`);
	}
};
