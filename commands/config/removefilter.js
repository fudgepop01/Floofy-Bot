const { Command } = require('discord.js-commando');

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
		const words = msg.guild.settings.get('filter', []);
		if (!words) return msg.reply('There are no filtered words.');
		words.splice(words.indexOf(args.word));
		msg.guild.settings.set('filter', words);
		return msg.reply(`The word \`${args.word}\` has been successfully whitelisted.`);
	}
};
