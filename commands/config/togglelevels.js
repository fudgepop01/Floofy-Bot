const { Command } = require('discord.js-commando');

module.exports = class ToggleLevelsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'togglelevels',
			group: 'config',
			memberName: 'togglelevels',
			description: 'Enables or disables leveling up.',
			guildOnly: true,
			examples: [
				'togglelevels true'
			],
			args: [
				{
					key: 'enabled',
					prompt: 'Would you like to enable or disable it?\n',
					type: 'boolean'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(msg, args) {
		let announce = msg.guild.settings.get('levelNotifs', false);
		announce = args.enabled;
		msg.guild.settings.set('levelNotifs', announce);
		return msg.reply(`Level announcements have been ${args.enabled ? 'enabled' : 'disabled'}.`);
	}
};
