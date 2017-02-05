const { Command } = require('discord.js-commando');

module.exports = class ReactFlairChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reactflairchannel',
			group: 'config',
			memberName: 'reactflairchannel',
			description: 'Sets the channel for automatic role assignment by reactions',
			guildOnly: true,
			examples: [
				'reactflairchannel flair_channel'
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
		const settings = this.client.provider.get(msg.guild, 'reactionflairs', {});
		settings.channel = args.channel.id;
		this.client.provider.set(msg.guild.id, 'reactionflairs', settings);
		return msg.reply(`I have successfully set ${args.channel} as the channel for automatic role assignment by reactions.`);
	}
};
