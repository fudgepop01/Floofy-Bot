const commando = require('discord.js-commando');
const CleverBot = require('cleverbot-node');

module.exports = class Chat extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'cat',
			group: 'fun',
			memberName: 'cat',
			description: 'Meow!',
			details: `Outputs a random cat.`,
			examples: ['cat']
		});
	}

	async run(message) {
		require('superagent')('GET', 'http://random.cat/meow')
		.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
		.set('User-Agent', 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36')
		.end((err, res) => {
			if (err) message.channel.sendMessage('There was an error, please try again!');
			else if (res.body) message.channel.sendMessage(res.body.file);
			else message.channel.sendMessage('There was an error, please try again!');
		});
	}
};
