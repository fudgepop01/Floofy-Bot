const commando = require('discord.js-commando');
const config = require('../../settings');

module.exports = class Chat extends commando.Command {
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

	async run(message, args) {
		let bot = message.client;
		// const safe = sconfig.nsfw.enabled ? 'off' : 'high';
	  let safe = 'high';
	  let url = `https://www.googleapis.com/customsearch/v1?key=${config.search.key}&cx=${config.search.cx}&safe=${safe}&q=${encodeURI(args.query)}`;
	  require('superagent').get(url).end((err, res) => {
	    if (err) return console.error(err);
	    if (res.body.queries.request[0].totalResults === '0') { return message.edit('No results found!'); }
	    else {
	      message.channel.send('Give me a moment...').then(msg => {
	        msg.edit(res.body.items[0].link).catch((err) => {
	          console.error(err);
	        });
	      });
	    }
	  });
	}
};
