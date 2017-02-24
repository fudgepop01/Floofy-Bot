const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class ToggleReactFlairCommand extends Command {
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
		let settings = await guildSettings.findOne({ where: { guildID: msg.guild.id } });
		if (!settings) settings = await guildSettings.create({ guildID: msg.guild.id });
		let reactions = settings.reactions;
		reactions.enabled = args.enabled;
		settings.reactions = reactions;
		await settings.save().catch(console.error);
		return msg.reply(`Reaction flairs have been ${args.enabled ? 'enabled' : 'diabled'}.`);
	}
};
