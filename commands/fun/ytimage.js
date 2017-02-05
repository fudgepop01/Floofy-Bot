const commando = require('discord.js-commando');
const request = require('superagent');

module.exports = class Chat extends commando.Command {
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

	async run(message, args) {
	  // var param = "/search?part=snippet&order=viewCount";
	  // var param = "/search?part=snippet&order=relevance&type=video&videoCategory=Gaming";
	  var param = '/search?part=snippet&safeSearch=strict';
	  let link = `https://www.googleapis.com/youtube/v3${param}&q=${args.query}&key=${config.ytimage}`;
	  let str = 'No result.';
	  request('GET', link).type('application/json').end((err, res) => {
	    if (err) { return message.channel.send('There was an error retrieveing your post. This is likely due to a daily limit being reached on the API.'); }
	    else {
	      let body = JSON.parse(res.text);
	      if (body.kind === 'youtube#searchListResponse') {
	        for (var i = 0; i < body.items.length; i++) {
	          str = body.items[i].snippet.thumbnails.high.url;
	        }
	        return message.channel.sendMessage(str);
	      }
	      else {
	        return message.channel.sendMessage('No result!');
	      }
	    }
	  });
	}
};
