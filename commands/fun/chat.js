const commando = require('discord.js-commando');
const CleverBot = require('cleverbot-node');

module.exports = class Chat extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'chat',
			group: 'fun',
			memberName: 'chat',
			description: 'Chat with me. Go on, try it!',
			details: `Simulates conversation through the Cleverbot API.`,
			examples: ['chat Do you love me?'],

			args: [
				{
					key: 'query',
					prompt: 'talk to me! Go on, don\'t be shy...',
					type: 'string'
				}
			]
		});
	}

	async run(message, args) {
		let cb = new CleverBot;
		CleverBot.prepare(() => {
			cb.write(args.query, (response) => {
				message.channel.startTyping();
				setTimeout(() => {
					message.channel.sendMessage(`\uD83D\uDCAC ${response.message}`);
					message.channel.stopTyping(true);
				}, response.message.length * 100);
			});
		});
	}
};
