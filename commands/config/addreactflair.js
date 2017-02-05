const { Command } = require('discord.js-commando');

module.exports = class AddReactFlairCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'addreactflair',
			group: 'config',
			memberName: 'addreactflair',
			description: 'Adds an emoji and a role to the list of self-assignable roles by reactions.',
			guildOnly: true,
			examples: [
				'addreactflair \u{1f609} frens'
			],
			args: [
				{
					key: 'emoji',
					prompt: 'What emoji would you like to add to the list of self-assignable reactions?\n',
					type: 'emoji'
				},
				{
					key: 'role',
					prompt: 'What role would you like to attach to the emoji?\n',
					type: 'role'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(msg, args) {
		const settings = this.client.provider.get(msg.guild, 'reactionflairs', {});
		settings[args.role.id] = args.emoji.id ? args.emoji.id : args.emoji;
		this.client.provider.set(msg.guild.id, 'reactionflairs', settings);
		return msg.reply(`I have successfully added ${args.role.name} and ${args.emoji} to the list of self-assignable roles by reactions.`);
	}
};
