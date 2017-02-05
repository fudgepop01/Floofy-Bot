const { Command } = require('discord.js-commando');

module.exports = class RoleStateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rolestate',
			group: 'config',
			memberName: 'rolestate',
			description: 'Enables or disables rolestate.',
			details: 'If rolestate is enabled, I will save the roles of any user that leaves and restore them when they rejoin.',
			guildOnly: true
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(msg) {
		const settings = this.client.provider.get(msg.guild, 'filter', { users: [] });
		settings.enabled ? settings.enabled = false : settings.enabled = true; // eslint-disable-line no-unused-expressions
		this.client.provider.set(msg.guild.id, 'filter', settings);
		return msg.reply(`Rolestate has been successfully ${settings.enabled ? 'enabled' : 'disabled'}!`);
	}
};
