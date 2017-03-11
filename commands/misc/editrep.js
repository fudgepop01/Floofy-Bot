const { Command } = require('discord.js-commando');
const GuildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');
const UserRep = require('../../dataProviders/postgreSQL/models/UserRep');

module.exports = class RepAddCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'editrep',
			group: 'misc',
			memberName: 'editrep',
			description: 'Changes a reputation message',
			guildOnly: true,

			args: [
				{
					key: 'member',
					prompt: 'to whom would you like to modify your reputation message for?',
					type: 'member'
				},
				{
					key: 'message',
					prompt: 'add a nice message.',
					type: 'string',
					max: 200,
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		const { member, message } = args;
		const settings = await GuildSettings.find({ where: { guildID: msg.guild.id } }) || await GuildSettings.create({ guildID: msg.guild.id });

		if (member.id === msg.author.id) return msg.reply('you can\'t change your own reputation like that!');

		const alreadyRepped = await UserRep.findOne({
			where: {
				userID: member.id,
				reputationBy: msg.author.id
			}
		});
		console.log(alreadyRepped);

		if (!alreadyRepped) return msg.reply(`you have *not* already given a ${settings.customRep ? settings.customRep : 'positive reputation'} point to this user.`);

		alreadyRepped.reputationMessage = message;
		await alreadyRepped.save();
		/*
		await UserRep.create({
			userID: member.id,
			reputationType: '+',
			reputationBy: msg.author.id,
			reputationMessage: message || null
		});
		*/

		return msg.reply(`you've successfully changed a ${settings.customRep ? settings.customRep : 'positive reputation'} point to ${member.displayName}.`);
	}
};
