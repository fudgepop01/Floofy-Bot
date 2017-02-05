const commando = require('discord.js-commando');

module.exports = class Distance extends commando.Command {
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
	async run(message, args) {
		let settings = this.client.provider.get(message.guild, 'filter', {});
		settings.push(args.word);
		this.client.provider.set(message.guild.id, 'filter', settings);
		return message.reply(`The word \`${args.word}\` has been successfully added to the list of blacklisted words.`);
	}
};
