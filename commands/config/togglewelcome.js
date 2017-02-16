const { Command } = require('discord.js-commando');
const types = ['all', 'private', 'public', 'pm'];

module.exports = class ServerLogsChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'togglewelcome',
			group: 'config',
			memberName: 'togglewelcome',
			description: 'Enables or disables welcome messages.',
			guildOnly: true,
			examples: [
				'togglewelcome all true',
				'togglewelcome private false',
				'togglewelcome public true'
			],
			args: [
				{
					key: 'type',
					prompt: `What type of welcome would you like to toggle? (${types.join(', ')})\n`,
					type: 'string',
					validate: (str) => {
						if (types.includes(str)) return true;
						else return false;
					},
					parse: (str) => {
						if (str.includes('private')) str.replace('private', 'pm');
					}
				},
				{
					key: 'enabled',
					prompt: 'Would you like to enable it or disable it?\n',
					type: 'boolean'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(msg, args) {
		const settings = this.client.provider.get(msg.guild, 'welcome', {});
		settings[args.type].enabled = args.enabled;
		this.client.provider.set(msg.guild.id, 'welcome', settings);
		return msg.reply(`${msg.client.funcs.capitalize(args.type)} has been ${args.enabled}.`);
	}
};
