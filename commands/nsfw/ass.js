const { Command } = require('discord.js-commando');
const superagent = require('superagent');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class AssCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ass',
			aliases: ['butts'],
			group: 'nsfw',
			memberName: 'ass',
			description: 'Outputs a random ass picture. Disabled by default.'
		});
	}

	async run(msg) {
		const settings = await guildSettings.findOne({ where: { guildID: msg.guild.id } });
		if (!settings) return msg.channel.send('NSFW is disabled for this server.');
		const nsfw = settings.nsfw;
		if (!nsfw || !nsfw.enabled || !nsfw.channels) return msg.channel.send('NSFW is disabled for this server.');
		if (!nsfw.channels.includes(msg.channel.id)) return msg.channel.send('NSFW is disabled for this channel.');
		const res = await superagent.get('http://api.obutts.ru/butts/0/1/random');
		if (!res) return msg.channel.send('No results.');
		return msg.channel.send(`http://media.obutts.ru/${res.body[0].preview}`);
	}
};
