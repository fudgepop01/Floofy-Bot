const { Command } = require('discord.js-commando');
const superagent = require('superagent');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class BoobsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'boobs',
			aliases: ['breasts'],
			group: 'nsfw',
			memberName: 'boobs',
			description: 'Outputs a random breast picture. Disabled by default.'
		});
	}

	async run(msg) {
		const settings = await guildSettings.findOne({ where: { guildID: msg.guild.id } });
		if (!settings) return msg.channel.send('NSFW is disabled for this server.');
		const nsfw = settings.nsfw;
		if (!nsfw || !nsfw.enabled || !nsfw.channels) return msg.channel.send('NSFW is disabled for this server.');
		if (!nsfw.channels.includes(msg.channel.id)) return msg.channel.send('NSFW is disabled for this channel.');
		const res = await superagent.get('http://api.oboobs.ru/boobs/0/1/random');
		if (!res) return msg.channel.send('No results.');
		return msg.channel.send(`http://media.oboobs.ru/${res.body[0].preview}`);
	}
};
