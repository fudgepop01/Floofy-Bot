const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class ServerLogsChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'publicmessage',
			group: 'config',
			memberName: 'publicmessage',
			description: 'Sets the public welcome message.',
			guildOnly: true,
			examples: [
				'publicmessage Welcome to the server, [user]!'
			],
			args: [
				{
					key: 'message',
					prompt: 'What should the public welcome message be?\n',
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
		let welcome = settings.welcome;
		if (!welcome.public) welcome.public = {};
		welcome.public.message = args.message;
		settings.welcome = welcome;
		return settings.save().then(async () => {
			msg.reply(`I have successfully set ${args.message} as the public welcome message.`);
		}).catch(console.error);
	}
};
