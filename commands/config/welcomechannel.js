const { Command } = require('discord.js-commando');

module.exports = class ServerLogsChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'welcomechannel',
			group: 'config',
			memberName: 'welcomechannel',
			description: 'Sets the channel for welcome messages.',
			guildOnly: true,
			examples: [
				'welcomechannel general'
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
		const settings = this.client.provider.get(msg.guild, 'welcome', {});
		settings.channel = args.channel.id;
		this.client.provider.set(msg.guild.id, 'welcome', settings);
		return msg.reply(`I have successfully set ${args.channel} as the destination channel for welcome messages.`);
	}
};
