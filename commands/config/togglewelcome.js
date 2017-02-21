const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');
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
						if (str.includes('private')) return str.replace('private', 'pm');
						else return str;
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
		let settings = await guildSettings.findOne({ where: { guildID: msg.guild.id } });
		if (!settings) settings = await guildSettings.create({ guildID: msg.guild.id });
		let welcome = settings.welcome;
		if (!welcome[args.type]) welcome[args.type] = {};
		args.type === 'all' ? welcome.enabled = args.enabled : welcome[args.type].enabled = args.enabled; // eslint-disable-line
		settings.welcome = welcome;
		return settings.save().then(async () => {
			msg.reply(`${msg.client.funcs.capitalize(args.type)} welcome messages have been ${args.enabled ? 'enabled' : 'disabled'}.`);
		}).catch(console.error);
	}
};
