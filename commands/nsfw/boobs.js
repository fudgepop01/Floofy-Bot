const { Command } = require('discord.js-commando');
const superagent = require('superagent');

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
		const nsfw = msg.client.provider.get(msg.guild, 'nsfw', {});
		if (!nsfw && !nsfw.enabled) return msg.channel.send('NSFW is disabled for this server.');
		if (nsfw.channels.includes(msg.channel.id)) return msg.channel.send('NSFW is disabled for this channel.');
		return superagent.get('http://api.oboobs.ru/boobs/0/1/random').then(res => {
			msg.channel.send(`http://media.oboobs.ru/${res[0].preview}`);
		})
		.catch(() => msg.channel.send('No results.'));
	}
};
