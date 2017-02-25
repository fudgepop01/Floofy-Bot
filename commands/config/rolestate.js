const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

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
		let settings = await guildSettings.findOne({ where: { guildID: msg.guild.id } });
		if (!settings) settings = await guildSettings.create({ guildID: msg.guild.id });
		let rolestate = settings.rolestate;
		rolestate.enabled ? rolestate.enabled = false : rolestate.enabled = true; // eslint-disable-line no-unused-expressions
		settings.rolestate = rolestate;
		await settings.save().catch(console.error);
		return msg.reply(`Rolestate has been successfully ${rolestate.enabled ? 'enabled' : 'disabled'}!`);
	}
};
