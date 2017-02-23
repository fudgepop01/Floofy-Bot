const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');
const Redis = require('../../dataProviders/redis/Redis');
const redis = new Redis();

module.exports = class ToggleFilterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'togglefilter',
			group: 'config',
			memberName: 'togglefilter',
			description: 'Enables or disables the filter.',
			guildOnly: true,
			examples: [
				'togglefilter true'
			],
			args: [
				{
					key: 'enabled',
					prompt: `Would you like to enable or disable the filter?`,
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
		let filter = settings.filter;
		filter.enabled = args.enabled;
		settings.filter = filter;
		await redis.db.setAsync(`filterenabled${msg.guild.id}`, JSON.stringify(filter.enabled)).catch(console.error);
		await settings.save().catch(console.error);
		return msg.reply(`Filtered words have been ${args.enabled ? 'enabled' : 'disabled'}.`);
	}
};
