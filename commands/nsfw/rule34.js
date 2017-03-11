const { Command } = require('discord.js-commando');
const superagent = require('superagent');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class Rule34Command extends Command {
	constructor(client) {
		super(client, {
			name: 'rule34',
			aliases: ['r34'],
			group: 'nsfw',
			memberName: 'rule34',
			description: 'Returns a random post from Rule 34. Disabled by default.',
			examples: ['rule34 lucario order:score'],
			guildOnly: true,

			args: [
				{
					key: 'tags',
					prompt: 'What would you like to look up, my kinky friend?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const settings = await guildSettings.findOne({ where: { guildID: msg.guild.id } });
		if (!settings) return msg.channel.send('NSFW is disabled for this server.');
		const nsfw = settings.nsfw;
		if (!nsfw || !nsfw.enabled || !nsfw.channels) return msg.channel.send('NSFW is disabled for this server.');
		if (!nsfw.channels.includes(msg.channel.id)) return msg.channel.send('NSFW is disabled for this channel.');
		superagent.get(`http://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${args.tags.split(' ').join('+')}`)
			.set('User-Agent', 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36')
			.then((res) => {
				const { parseString } = require('xml2js');
				parseString(res.text, (error, result) => {
					if (error) {
						return msg.channel.sendMessage('There was an error parsing to JSON for some reason...');
					} else if (!result.posts.post) {
						return msg.channel.sendMessage('No results!');
					} else { return msg.channel.sendMessage(`http://${result.posts.post[Math.floor(Math.random() * result.posts.post.length)].$.file_url.substring(6)}`); }
				});
			})
			.catch(() => {
				return msg.channel.send('There was an error retrieving posts.');
			});
	}
};
