const { Command } = require('discord.js-commando');
const superagent = require('superagent');

const { giphy } = require('../../settings');

module.exports = class GiphySearchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'giphysearch',
			group: 'fun',
			memberName: 'giphysearch',
			description: 'Search for gifs through Gyphy',
			examples: ['giphysearch lucario'],
			throttling: {
				usages: 2,
				duration: 60
			},
			args: [
				{
					key: 'query',
					prompt: 'What would you like to search?\n',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const link = `http://api.giphy.com/v1/gifs/search?q=${args.query.split(' ').join('+')}&api_key=${giphy}&limit=50`;

		superagent.get(link)
			.then(res => {
				return msg.say(res.body.data[Math.floor(Math.random() * res.body.data.length)].images.original.url);
			})
			.catch(err => {
				msg.say('There was an error, please try again later.');
				return console.error(err);
			});
	}
};
