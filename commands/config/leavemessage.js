const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class LeaveMessageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leavemessage',
			group: 'config',
			memberName: 'leavemessage',
			description: 'Sets the leave message.',
			guildOnly: true,
			examples: [
				'leavemessage Goodbye, [user]!'
			],
			args: [
				{
					key: 'message',
					prompt: 'What should the leave welcome message be?\n',
					type: 'string',
					parse: (str) => {
						return str.replace(/\[user]/g, 'USER');
					}
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(msg, args) {
		let settings = await guildSettings.findOne({ where: { guildID: msg.guild.id } });
		if (!settings) settings = await guildSettings.create({ guildID: msg.guild.id });
		let leave = settings.leave;
		leave.message = args.message;
		settings.leave = leave;
		await settings.save().catch(console.error);
		return msg.reply(`I have successfully set ${args.message} as the leave message.`);
	}
};
