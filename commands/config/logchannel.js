const { Command } = require('discord.js-commando');

module.exports = class ServerLogsChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'logchannel',
			group: 'config',
			memberName: 'logchannel',
			description: 'Sets the channel for server logs.',
			guildOnly: true,
			examples: [
				'logchannel evidence_dot_zip'
			],
			args: [
				{
					key: 'channel',
					prompt: 'What channel would you like to set?\n',
					type: 'channel'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(msg, args) {
		const settings = this.client.provider.get(msg.guild, 'logs', {});
		settings.channel = args.channel.id;
		this.client.provider.set(msg.guild.id, 'logs', settings);
		return msg.reply(`I have successfully set ${args.channel} as the channel for server logs.`);
	}
};
