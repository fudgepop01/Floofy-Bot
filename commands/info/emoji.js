const { Command } = require('discord.js-commando');

module.exports = class EmojiInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emoji-info',
			aliases: ['emoji', 'emote', 'emote-info'],
			group: 'info',
			memberName: 'emoji',
			description: 'Get info on an emoji.',
			details: `Get detailed information on the specified emoji. Both global and custom emojis will work.`,
			guildOnly: false,

			args: [
				{
					key: 'emoji',
					prompt: 'what emoji would you like to have information on?\n',
					type: 'emoji'
				}
			]
		});
	}

	async run(msg, args) {
		const info = {};
		if (args.emoji.id) {
			if (!args.emoji.id) info.server = 'unknown';
			info.server = `${args.emoji.guild.name} (${args.emoji.guild.id})`;
			info.url = `https://cdn.discordapp.com/emojis/${args.emoji.id}.png`;
			info.name = args.emoji.name;
			info.id = args.emoji.id;
		}

		info.emoji = `${String.fromCodePoint(args.emoji.codePointAt(0))}\`${args.emoji}\``;
		info.codePoint = args.emoji.codePointAt(0);
		info.hex = info.codePoint.toString(16);
		info.usage = `\`\\u{${info.hex}}\``;
		let out = '__**Emoji Information**__\n';
		for (let key in info) {
			if (key !== 'url') out += `**${key.charAt(0).toUpperCase()+key.substring(1)}**: ${info[key]}\n`;
		}
		return msg.embed({
			color: 3447003,
			description: out,
			image: { url: info.url ? info.url : null }
		});
	}
};
