const { Command } = require('discord.js-commando');

module.exports = class AvatarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'avatar',
			group: 'info',
			memberName: 'avatar',
			description: 'Get a user\'s avatar.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'user',
					prompt: 'what user would you like to see the avatar of?\n',
					type: 'user',
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		const user = args.user.hasOwnProperty('id') ? args.user : msg.author;
		return msg.channel.sendFile(user.displayAvatarURL.replace('jpg', 'png').substring(0, user.displayAvatarURL.length - 10)).catch(() => null);
	}
};
