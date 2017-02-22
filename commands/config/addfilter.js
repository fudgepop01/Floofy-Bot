const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings')

module.exports = class AddFilterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'addfilter',
			group: 'config',
			memberName: 'addfilter',
			description: 'Blacklists a word in the server.',
			guildOnly: true,
			examples: [
				'addfilter bitch'
			],
			args: [
				{
					key: 'word',
					prompt: 'What word would you like blacklisted?\n',
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
 		if (!filter.words) filter.words = [];
		if (filter.words.includes(args.word)) return msg.reply(`The word \`${args.word}\` is already blacklisted.`);
		filter.words.push(args.word);
		settings.filter = filter;
		return settings.save().then(() => {
			msg.reply(`The word \`${args.word}\` has been successfully added to the list of blacklisted words.`);
		}).catch(console.error);
	}
};
