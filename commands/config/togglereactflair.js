const { Command } = require('discord.js-commando');

module.exports = class ServerLogsChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'togglereactflair',
			group: 'config',
			memberName: 'togglereactflair',
			description: 'Enables or disables reaction flairs.',
			guildOnly: true,
			examples: [
				'togglereactflair enable'
			],
			args: [
				{
					key: 'enabled',
					prompt: 'Would you like to enable or disable reaction flairs?\n',
					type: 'boolean'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(msg, args) {
		const settings = msg.guild.settings.get('reactionflairs', {});
		settings.enabled = args.enabled;
		msg.guild.settings.set('reactionflairs', settings);
		return msg.reply(`Reaction flairs have been ${args.enabled ? 'enabled' : 'diabled'}.`);
	}
};
