const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class LeaveChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leavechannel',
			group: 'config',
			memberName: 'leavechannel',
			description: 'Sets the channel for leave messages.',
			guildOnly: true,
			examples: [
				'leavechannel general'
			],
			args: [
				{
					key: 'channel',
					prompt: 'What channel would you like to set?\n',
					type: 'channel'
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
		leave.channel = args.channel.id;
		settings.leave = leave;
		await settings.save().catch(console.error);
		return msg.reply(`I have successfully set ${args.channel} as the destination channel for welcome messages.`);
	}
};
