const { Command } = require('discord.js-commando');

module.exports = class UnMuteUserCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unmute',
			group: 'mod',
			memberName: 'unmute',
			description: 'Unmutes a user.',
			guildOnly: true,

			args: [
				{
					key: 'member',
					prompt: 'What user would you like to unmute?\n',
					type: 'member'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_MESSAGES');
	}

	async run(msg, args) {
		const member = args.member;
		const user = member.user;
		if (!this.client.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return msg.reply('I do not have the `manage roles` permission.');
		const settings = this.client.provider.get(msg.guild, 'muted', []);
		if (!settings.includes(member.id)) return msg.say(`The user ${member.id} isn't muted!`);
		if (!msg.guild.roles.has(msg.guild.roles.find('name', 'Muted')).id) await msg.guild.createRole({ name: 'Muted', position: 0 }).then(() => msg.reply('A role `Muted` has been created. Make sure it\'s sorted correctly (ideally at the top)!'));
		settings.splice(settings.indexOf(member.id));
		this.client.provider.set(msg.guild.id, 'muted', settings);
		await member.addRoles([msg.guild.roles.find('name', 'Muted')]);
		return msg.reply(`I have successfully unmuted ${user.username}.`);
		// mod logs
	}
};
