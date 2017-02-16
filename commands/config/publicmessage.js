const { Command } = require('discord.js-commando');

module.exports = class ServerLogsChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'publicmessage',
			group: 'config',
			memberName: 'publicmessage',
			description: 'Sets the public welcome message.',
			guildOnly: true,
			examples: [
				'publicmessage Welcome to the server, [user]!'
			],
			args: [
				{
					key: 'message',
					prompt: 'What should the public welcome message be?\n',
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
		settings.public.message = args.message;
		this.client.provider.set(msg.guild.id, 'welcome', settings);
		return msg.reply(`I have successfully set ${args.message} as the public welcome message.`);
	}
};
