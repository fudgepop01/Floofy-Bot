const { Command } = require('discord.js-commando');
const request = require('superagent');
const htmlToJSON = require('htm-to-json').convert_html_to_json;

module.exports = class DogCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dog',
			group: 'fun',
			memberName: 'dog',
			description: 'Outputs a random dog.'
		});
	}

	async run(msg) {
		const link = 'http://random.dog/';
		request.get(link)
		.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
		.set('User-Agent', 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36')
		.end((error, res) => {
			if (error) return msg.say('There was an error, please try again!');
			return htmlToJSON(res.text, (err, data) => {
				if (err) return msg.say('There was an error, please try again!');
				return msg.say(link + data.img[0].src);
			});
		});
	}
};
