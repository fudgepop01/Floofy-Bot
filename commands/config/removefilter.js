const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');
const Redis = require('../../dataProviders/redis/Redis');
const redis = new Redis();

module.exports = class RemoveFilterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'removefilter',
			group: 'config',
			memberName: 'removefilter',
			description: 'Removes a blacklisted word.',
			guildOnly: true,
			examples: [
				'removefilter bitch'
			],
			args: [
				{
					key: 'word',
					prompt: 'What word would you like removed from the blacklist??\n',
					type: 'string'
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
		if (!filter.words) return msg.reply('There are no filtered words.');
		if (!filter.words.includes(args.word)) return msg.reply(`The word \`${args.word}\` is not blacklisted.`);
		filter.words.splice(filter.words.indexOf(args.word));
		settings.filter = filter;
		await redis.db.setAsync(`filter${msg.guild.id}`, JSON.stringify(filter.words)).catch(console.error);
		await settings.save().catch(console.error);
		return msg.reply(`The word \`${args.word}\` has been successfully whitelisted.`);
	}
};
