const { Command } = require('discord.js-commando');
const starBoard = require('../../dataProviders/postgreSQL/models/StarBoard');

module.exports = class ChatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unstar',
			group: 'fun',
			memberName: 'unstar',
			description: 'Unstars a message.',
			examples: ['unstar 189696688657530880'],

			args: [
				{
					key: 'message',
					prompt: 'What would you like to unstar?\n',
					type: 'message',
					default: null
				}
			]
		});
	}

	async run(msg, args) {
		if (!args.message) return msg.reply('Please specify a message ID.');
		const starboard = msg.guild.channels.find('name', 'starboard');
		if (!starboard) return msg.reply('I could not find a channel named `starboard`.');
		const settings = await starBoard.findOne({ where: { guildID: msg.guild.id } });
		if (!settings) return msg.reply('Nobody\'s starred before!');
		let starred = settings.starred;
		if (!starred.hasOwnProperty(args.message.id)) return msg.reply('This message isn\t starred...');
		if (!starred[args.message.id].stars.includes(msg.author.id)) return msg.reply('You can only unstar a message you have starred before!');
		const starCount = starred[args.message.id].count -= 1;
		const starredMessage = await starboard.fetchMessage(starred[args.message.id].starredMessageID).catch(null);
		if (starred[args.message.id].count === 0) {
			delete starred[args.message.id];
			await starredMessage.delete().catch(null);
		} else {
			const edit = starredMessage.content.replace(`⭐ ${starCount + 1}`, `⭐ ${starCount}`);
			await starredMessage.edit(edit);
			starred[args.message.id].count = starCount;
			starred[args.message.id].stars.splice(starred[args.message.id].stars.indexOf(msg.author.id));
		}
		settings.starred = starred;
		await settings.save().catch(console.error);
		return msg.delete().catch(null);
	}
};
