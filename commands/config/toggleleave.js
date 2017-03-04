const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class ToggleLeaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'toggleleave',
			group: 'config',
			memberName: 'toggleleave',
			description: 'Enables or disables leave messages.',
			guildOnly: true,
			examples: [
				'toggleleave true'
			],
			args: [
				{
					key: 'enabled',
					prompt: 'Would you like to enable it or disable leave messages?\n',
					type: 'boolean'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(msg, args) {
		let settings = await guildSettings.findOne({ where: { guildID: msg.guild.id } });
		if (!settings) settings = await guildSettings.create({ guildID: msg.guild.id });
		let leave = settings.leave;
		leave.enabled = args.enabled;
		settings.leave = leave;
		await settings.save();
		return msg.reply(`Leave messages have been ${args.enabled ? 'enabled' : 'disabled'}.`);
	}
};
