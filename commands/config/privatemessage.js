const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class ServerLogsChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'privatemessage',
			group: 'config',
			memberName: 'privatemessage',
			description: 'Sets the private welcome message.',
			guildOnly: true,
			examples: [
				'privatemessage Welcome to the server, [user]!'
			],
			args: [
				{
					key: 'message',
					prompt: 'What should the private welcome message be?\n',
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
		if (!welcome.private) welcome.private = {};
		welcome.private.message = args.message;
		settings.welcome = welcome;
		return settings.save().then(async () => {
			msg.reply(`I have successfully the new private welcome message:\n\`${args.message}\``);
		}).catch(console.error);
	}
};
