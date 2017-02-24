const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class ServerLogsChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'togglelogs',
			group: 'config',
			memberName: 'togglelogs',
			description: 'Enables or disables welcome messages.',
			guildOnly: true,
			examples: [
				'togglelogs enable'
			],
			args: [
				{
					key: 'enabled',
					prompt: 'Would you like to enable or disable logs?\n',
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
		let logs = settings.logs;
		logs.enabled = args.enabled;
		settings.logs = logs;
		await settings.save().catch(console.error);
		return msg.reply(`logging has been ${args.enabled ? 'enabled' : 'disabled'}.`);
	}
};
