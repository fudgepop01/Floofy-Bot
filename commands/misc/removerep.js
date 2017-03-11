const { Command } = require('discord.js-commando');
const GuildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');
const UserRep = require('../../dataProviders/postgreSQL/models/UserRep');

module.exports = class RepRemoveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'removerep',
			aliases: ['rep-remove', 'rep-rem', 'rem-rep', 'rep-neg', 'neg-rep'],
			group: 'misc',
			memberName: 'removerep',
			description: 'Add a negative reputation point to a user.',
			guildOnly: true,

			args: [
				{
					key: 'member',
					prompt: 'whom would you like to give a negative reputation point?',
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
		if (!msg.author.id !== this.client.options.owner) return;
		const { member, message } = args;
		const settings = await GuildSettings.find({ where: { guildID: msg.guild.id } }) || await GuildSettings.create({ guildID: msg.guild.id });

		if (member.id === msg.author.id) return msg.reply('you can\'t change your own reputation like that!');

		const alreadyRepped = await UserRep.findOne({
			where: {
				userID: member.id,
				reputationBy: msg.author.id
			}
		});

		if (alreadyRepped && alreadyRepped.reputationType === '-') return msg.reply(`you have already given a ${settings.customRep ? settings.customRep : 'negative reputation'} point to this user.`);
		if (alreadyRepped) await alreadyRepped.destroy();

		await UserRep.create({
			userID: member.id,
			reputationType: '-',
			reputationBy: msg.author.id,
			reputationMessage: message || null
		});

		return msg.reply(`you've successfully added a ${settings.customRep ? settings.customRep : 'negative reputation'} point to ${member.displayName}.`);
	}
};
