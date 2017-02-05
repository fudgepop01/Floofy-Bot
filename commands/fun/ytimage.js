const { Command } = require('discord.js-commando');
const request = require('superagent');

const config = require('../../settings');

module.exports = class YouTubeImageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ytimage',
			group: 'fun',
			aliases: ['youtube', 'ytimagesearch', 'ytsearch'],
			memberName: 'ytimage',
			description: 'Search through the world\'s most powerful search engine via YouTube.',
			examples: ['ytimage lucario'],
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
		// const param = "/search?part=snippet&order=viewCount";
		// const param = "/search?part=snippet&order=relevance&type=video&videoCategory=Gaming";
		const param = '/search?part=snippet&safeSearch=strict';
		const link = `https://www.googleapis.com/youtube/v3${param}&q=${args.query}&key=${config.ytimage}`;
		let str = 'No result.';
		request.get(link)
		.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
		.set('User-Agent', 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36')
		.end((error, res) => {
			if (error) return msg.say('There was an error retrieveing your post. This is likely due to a daily limit being reached on the API.');
			const body = JSON.parse(res.text);
			if (body.kind === 'youtube#searchListResponse') {
				for (let i = 0; i < body.items.length; i++) {
					str = body.items[i].snippet.thumbnails.high.url;
				}
				return msg.say(str);
			}
			return msg.say(str);
		});
	}
};
