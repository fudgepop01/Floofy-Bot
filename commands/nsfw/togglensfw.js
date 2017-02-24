const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class ToggleNSFWCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'togglensfw',
			group: 'nsfw',
			memberName: 'togglensfw',
			description: 'Enables or disables NSFW for the server.',
			guildOnly: true,
			examples: [
				'togglensfw true'
			],
			args: [
				{
					key: 'enabled',
					prompt: `Would you like to enable or disable NSFW?\n`,
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
		let nsfw = settings.nsfw;
		nsfw.enabled = args.enabled;
		settings.nsfw = nsfw;
		await settings.save().catch(console.error);
		return msg.reply(`NSFW has been ${args.enabled ? 'enabled' : 'disabled'}.`);
	}
};
