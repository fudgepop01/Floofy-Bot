const { Command } = require('discord.js-commando');
const request = require('superagent');

const config = require('../../settings');

module.exports = class SearchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'search',
			group: 'fun',
			memberName: 'search',
			description: 'Search through the world\'s most powerful search engine.',
			examples: ['search lucario'],
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
		const query = args.query;
		// const safe = sconfig.nsfw.enabled ? 'off' : 'high';
		const safe = 'high';
		const link = `https://www.googleapis.com/customsearch/v1?key=${config.search.key}&cx=${config.search.cx}&safe=${safe}&q=${encodeURI(query)}`;

		request.get(link)
		.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
		.set('User-Agent', 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36')
		.end((error, res) => {
			if (error) return msg.say('There was an error, please try again!');
			if (res.body.queries.request[0].totalResults === '0') return msg.say('No results found!');
			return msg.say(res.body.items[0].link);
		});
	}
};
