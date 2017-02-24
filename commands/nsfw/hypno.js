const { Command } = require('discord.js-commando');
const superagent = require('superagent');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class HypnohubCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hypno',
			group: 'nsfw',
			memberName: 'hypno',
			description: 'Returns a random post from hypnohub. Disabled by default.',
			examples: ['hypno order:score'],

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
		if (!nsfw && !nsfw.enabled) return msg.channel.send('NSFW is disabled for this server.');
		if (!nsfw.channels.includes(msg.channel.id)) return msg.channel.send('NSFW is disabled for this channel.');
		let str = 'No result.';
		return superagent.get(`http://hypnohub.net/post/index.json?&tags=$${encodeURI(args.tags)}`)
		.set('User-Agent', 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36')
		.end((err, res) => {
			if (err) { return msg.channel.send('There was an error retrieving posts.'); }	else {
				let body = JSON.parse(res.text);
				for (var i = 0; i < 101; i++) {
					var rand = Math.floor(Math.random() * 101);
					if (body[rand] && body[rand].file_url) {
						str = `http://${body[rand].file_url.substring(2)}`;
						break;
					}
				}
				return msg.channel.sendMessage(str);
			}
		});
	}
};
