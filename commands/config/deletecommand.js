const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');
const Redis = require('../../dataProviders/redis/Redis');
const redis = new Redis();

module.exports = class DeleteCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'deletecommand',
			group: 'config',
			aliases: ['deletecmd', 'removecmd', 'removecommand'],
			memberName: 'deletecommand',
			description: 'Deletes a custom command from the server.',
			guildOnly: true,
			examples: [
				'deletecommand say'
			],
			args: [
				{
					key: 'name',
					prompt: 'Please enter the name of the custom command to delete.',
					type: 'string'
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
		let customcommands = settings.customcommands;
		// if (!args.name.includes(',')) args.name = [args.name.slice(0, 0), ',', args.name.slice(0)].join('');
		// if (args.name.includes(',')) args.name = args.name.replace(',', '').trim();
		if (!customcommands[args.name]) return msg.reply(`The command \`${args.name}\` does not exist!`);
		delete customcommands[args.name];
		settings.customcommands = customcommands;
		await redis.db.delAsync(`customcommand${msg.guild.id}${args.name}`).catch(console.error);
		await settings.save().catch(console.error);
		return msg.reply(`The command \`${args.name}\` has been successfully removed.`);
	}
};
