const { Command } = require('discord.js-commando');
// const CleverBot = require('cleverbot-node');
const Cleverbot = require('cleverbot.io');
const config = require('../../settings.json');
const bot = new Cleverbot(config.user, config.key);

module.exports = class ChatCommand extends Command {
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

	hasPermission(msg) {
		return this.client.options.owner === msg.author.id;
	}

	async run(msg, args) {
		/*
		const cb = new CleverBot;
		CleverBot.prepare(() => {
			cb.write(args.query, (response) => {
				msg.channel.startTyping();
				setTimeout(() => {
					msg.say(`\uD83D\uDCAC ${response.message}`);
					msg.channel.stopTyping(true);
				}, response.message.length * 100);
			});
		});
		*/
		bot.create((error, session) => {
			if (error) return msg.reply('There was an error, please try again another time... :()');
			bot.ask(args.query, (err, response) => {
				if (err) return msg.reply('There was an error, please try again another time...');
				msg.channel.startTyping();
				setTimeout(() => {
					msg.say(`\uD83D\uDCAC ${response}`);
					msg.channel.stopTyping(true);
				}, response.length * 100);
			});
		});
	}
};
