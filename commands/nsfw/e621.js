const { Command } = require('discord.js-commando');
const superagent = require('superagent');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class E621Command extends Command {
	constructor(client) {
		super(client, {
			name: 'e621',
			group: 'nsfw',
			memberName: 'e621',
			description: 'Returns a random post from e621. Disabled by default.',
			examples: ['e621 lucario order:score'],

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
		let settings = await guildSettings.findOne({ where: { guildID: msg.guild.id } });
		if (!settings) settings = await guildSettings.create({ guildID: msg.guild.id });
		const nsfw = settings.nsfw;
		if (!nsfw || !nsfw.enabled) return msg.channel.send('NSFW is disabled for this server.');
		if (!nsfw.channels || !nsfw.channels.includes(msg.channel.id)) return msg.channel.send('NSFW is disabled for this channel.');
		let str = 'No result.';
		return superagent.get(`https://e621.net/post/index.json?limit=100&tags=${encodeURI(args.tags)}`)
		.set('User-Agent', 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36')
		.end((err, res) => {
			if (err) { return msg.channel.send('There was an error retrieving posts.'); }	else {
				let body = res.body;
				for (var i = 0; i < 101; i++) {
					var rand = Math.floor(Math.random() * 101);
					if ((body[rand] && body[rand].file_url) && (body[rand].file_ext === 'jpg' || body[rand].file_ext === 'png' || body[rand].file_ext === 'gif')) {
						str = body[rand].file_url;
						break;
					}
				}
				return msg.channel.send(str);
			}
		});
	}
};
