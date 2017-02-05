const commando = require('discord.js-commando');
const CleverBot = require('cleverbot-node');

module.exports = class Chat extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'dog',
			group: 'fun',
			memberName: 'dog',
			description: 'Outputs a random dog.'
		});
	}

	async run(message) {
		let link = 'http://random.dog/';
		require('superagent')('GET', link).end((err, res) => {
			if (err) { message.channel.sendMessage('There was an error, please try again!'); }
			else {
				require('htm-to-json').convert_html_to_json(res.text, (err, data) => {
					if (err) return message.channel.sendMessage('There was an error, please try again!');
					else return message.channel.sendMessage(link + data.img[0].src);
				});
			}
		});
	}
};
