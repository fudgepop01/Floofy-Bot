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
		const settings = this.client.provider.get(msg.guild, 'filter', {});
		settings.splice(settings.indexOf(args.word));
		this.client.provider.set(msg.guild.id, 'filter', settings);
		return msg.reply(`The word \`${args.word}\` has been successfully whitelisted.`);
	}
};
