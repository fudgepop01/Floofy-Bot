const { Command } = require('discord.js-commando');

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
		const settings = this.client.provider.get(msg.guild, 'filter', {});
		if (!settings.words) settings.words = [];
		settings.words.push(args.word);
		this.client.provider.set(msg.guild.id, 'filter', settings);
		return msg.reply(`The word \`${args.word}\` has been successfully added to the list of blacklisted words.`);
	}
};
