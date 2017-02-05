const commando = require('discord.js-commando');

module.exports = class Distance extends commando.Command {
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
	async run(message) {
		let settings = this.client.provider.get(message.guild, 'filter', { users: [] });
		settings.enabled ? settings.enabled = false : settings.enabled = true;
		this.client.provider.set(message.guild.id, 'filter', settings);
		return message.reply(`Rolestate has been successfully ${settings.enabled ? 'enabled' : 'disabled'}!`);
	}
};
