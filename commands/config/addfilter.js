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
		let words = msg.guild.settings.get('filter', []);
		words.push(args.word);
		msg.guild.settings.set('filter', words);
		return msg.reply(`The word \`${args.word}\` has been successfully added to the list of blacklisted words.`);
	}
};
