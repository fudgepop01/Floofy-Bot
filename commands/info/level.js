const { Command } = require('discord.js-commando');
const Experience = require('../../currency/Experience');

module.exports = class LevelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'level',
			group: 'info',
			memberName: 'level',
			description: 'Returns your level. Temporary command until profiles come.',
			guildOnly: true
		});
	}

	async run(message, args) {
		const level = await Experience.getLevel(message.author.id);
		const exp = await Experience.getTotalExperience(message.author.id);
		return message.reply(`your level is ${level} with ${exp} XP.`);
	}
};
