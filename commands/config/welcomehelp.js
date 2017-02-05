const { Command } = require('discord.js-commando');

module.exports = class WelcomeHelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'welcomehelp',
			group: 'config',
			memberName: 'welcomehelp',
			description: 'Details on how to set up welcome messages'
		});
	}

	async run(msg) {
		return msg.embed({
			color: parseInt('cc0000', 16),
			title: 'How to set up welcome messages for your server!',
			fields: [
				{
					name: '**Step 1**: Set a welcome message for new members',
					value: 'In order to do this, type `welcome public message` or `welcome pm <message>`, where `message` is what the user will see when they join. In order to include a user mention. type `[user]` where the mention would go. If I picked this up, I will say `USER` in the feedback.'
				},
				{
					name: '**Step 2**: Provide a channel',
					value: 'If you want *public* welcome messages, read this. Type `welcome public channel <channel>` to give the public welcome message a place to go.'
				},
				{
					name: '**Step 3**: Enable it',
					value: 'In order to do this, type in `welcome enable` to enable both public and private welcome messages. You can disable this at any point in time, just use `disable` instead of `enable`.\nIn case you wish to enable or disable one or the other specifically, type `welcome enable pm` or `welcome disable public`.'
				}
			]
		});
	}
};
