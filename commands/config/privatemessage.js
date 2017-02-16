const { Command } = require('discord.js-commando');

module.exports = class ServerLogsChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'privatemessage',
			group: 'config',
			memberName: 'privatemessage',
			description: 'Sets the private welcome message.',
			guildOnly: true,
			examples: [
				'privatemessage Welcome to the server, [user]!'
			],
			args: [
				{
					key: 'message',
					prompt: 'What should the private welcome message be?\n',
					type: 'string',
					parse: (str) => {
						return str.replace(/\[user]/g, 'USER');
					}
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(msg, args) {
		const settings = this.client.provider.get(msg.guild, 'welcome', {});
		settings.private.message = args.message;
		this.client.provider.set(msg.guild.id, 'welcome', settings);
		return msg.reply(`I have successfully set ${args.message} as the private welcome message.`);
	}
};
