const { Command } = require('discord.js-commando');

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
		const settings = msg.guild.settings.get('logs', {});
		settings.enabled = args.enabled;
		msg.guild.settings.set('welcome', settings);
		return msg.reply(`logging has been ${args.enabled ? 'enabled' : 'disabled'}.`);
	}
};
