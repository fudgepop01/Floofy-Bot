const commando = require('discord.js-commando');

module.exports = class Distance extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'removereactflair',
			group: 'config',
			memberName: 'removereactflair',
			description: 'Removes a role (with its emoji) from the list of self-assignable roles by reactions.',
			guildOnly: true,
			examples: [
				'removereactflair frens'
			],
			args: [
				{
					key: 'role',
					prompt: 'What role would you remove?\n',
					type: 'role'
				}
			]
		});
	}
	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}
	async run(message, args) {
		let settings = this.client.provider.get(message.guild, 'reactionflairs', {});
		delete settings[args.role.id];
		this.client.provider.set(message.guild.id, 'reactionflairs', settings);
		return message.reply(`I have successfully removed ${args.role.name} from the list of self-assignable roles by reactions.`);
	}
};
