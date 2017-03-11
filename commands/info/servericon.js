const { Command } = require('discord.js-commando');

module.exports = class ServerIconCOmmand extends Command {
	constructor(client) {
		super(client, {
			name: 'servericon',
			group: 'info',
			memberName: 'servericon',
			description: 'Get a server\'s icon.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	async run(msg) {
		return msg.channel.sendFile(msg.guild.iconURL).catch(() => null);
	}
};
