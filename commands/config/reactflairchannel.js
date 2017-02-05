const commando = require('discord.js-commando');

module.exports = class Distance extends commando.Command {
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
	async run(message, args) {
		let settings = this.client.provider.get(message.guild, 'reactionflairs', {});
		settings.channel = args.channel.id;
		this.client.provider.set(message.guild.id, 'reactionflairs', settings);
		return message.reply(`I have successfully set ${args.channel} as the channel for automatic role assignment by reactions.`);
	}
};
