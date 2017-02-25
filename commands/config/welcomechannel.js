const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class ServerLogsChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'welcomechannel',
			group: 'config',
			memberName: 'welcomechannel',
			description: 'Sets the channel for welcome messages.',
			guildOnly: true,
			examples: [
				'welcomechannel general'
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
		let welcome = settings.welcome;
		if (!welcome.public) welcome.public = {};
		welcome.public.channel = args.channel.id;
		settings.welcome = welcome;
		return settings.save().then(async () => {
			msg.reply(`I have successfully set ${args.channel} as the destination channel for welcome messages.`);
		}).catch(console.error);
	}
};
