const { Command } = require('discord.js-commando');
const modlogs = require('../../dataProviders/postgreSQL/models/Modlogs');

module.exports = class ModlogsChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'modlogchannel',
			group: 'config',
			memberName: 'modlogchannel',
			description: 'Sets the channel for modlogs.',
			guildOnly: true,
			examples: [
				'modlogchannel mod_channel'
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
		let settings = await modlogs.findOne({ where: { guildID: msg.guild.id } });
		if (!settings) settings = await modlogs.create({ guildID: msg.guild.id });
		// let mod = settings.mod;
		settings.channelID = args.channel.id;
		// settings.mod = mod;
		await settings.save().catch(console.error);
		return msg.reply(`I have successfully set ${args.channel} as the destination channel for modlogs.`);
	}
};
