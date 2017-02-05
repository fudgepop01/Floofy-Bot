const { Command } = require('discord.js-commando');
const request = require('superagent');

module.exports = class CatCommand extends Command {
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

	async run(msg) {
		request.get('http://random.cat/meow')
		.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
		.set('User-Agent', 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36')
		.end((err, res) => {
			if (err) return msg.say('There was an error, please try again!');
			if (res.body) return msg.say(res.body.file);
			return msg.say('There was an error, please try again!');
		});
	}
};
