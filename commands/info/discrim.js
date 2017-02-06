const { Command } = require('discord.js-commando');

module.exports = class UserInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'discrim',
			aliases: ['discriminator'],
			group: 'info',
			memberName: 'discrim',
			description: 'Find the usernames of a certain discriminator.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'discrim',
					prompt: 'what discrminator would you like to search?\n',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		fetch(msg.client, args.discrim).then(results => {
			msg.channel.send(`There are ${results.length} users with the discriminator ${args.discrim}:\n${results.join(', ')}`);
		});
	}
};


function fetch(bot, discrim) {
	return new Promise((resolve, reject) => {
		resolve(bot.users.filter(user => user.discriminator === discrim).map(user => user.username));
	});
}
