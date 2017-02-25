const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const moment = require('moment');

const Redis = require('../../dataProviders/redis/Redis');
const redis = new Redis();

module.exports = class ChatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'star',
			group: 'fun',
			memberName: 'star',
			description: 'Stars a message.',
			examples: ['star 189696688657530880'],

			args: [
				{
					key: 'message',
					prompt: 'What would you like to star?\n',
					type: 'message',
					default: null
				}
			]
		});
	}

	async run(msg, args) {
		const starboard = msg.guild.channels.find('name', 'starboard');
		if (!starboard) return;
		let image;
		if (args.message.attachments.some(attachment => attachment.url.match(/\.(png|jpg|jpeg|gif|webp)$/))) image = args.message.attachments.first().url;
		await starboard.send(stripIndents`
			●▬▬▬▬▬▬▬▬▬▬▬▬▬▬●
			**Author**: \`${args.message.author.username} #${args.message.author.discriminator}\` | **Channel**: \`${args.message.channel.name}\` | **ID**: \`${args.message.id}\` | **Time**: \`${moment(new Date()).format('DD/MM/YYYY @ hh:mm:ss a')}\`
			**Message**:
			${args.message.cleanContent}
			`, { file: image }).catch(null);
		await redis.db.setAsync(`star${msg.guild.id}${msg.author.id}`, args.message.cleanContent).catch(console.error);
		msg.delete().catch(null);
		return;
	}
};
