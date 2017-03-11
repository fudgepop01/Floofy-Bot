const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');
const Redis = require('../../dataProviders/redis/Redis');
const redis = new Redis();

module.exports = class CreateCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'createcommand',
			group: 'config',
			aliases: ['createcmd'],
			memberName: 'createcommand',
			description: 'Create a custom command for your server.',
			guildOnly: true,
			details: oneLine`
				Format is: \`.createcommand name response\`\n
				For responses with a random selection: \`.createcommand name response $rand:{item1; item2; item3}\`\`\n
			`,
			examples: [
				'createcommand say hello',
				'createcommand randompicture $rand:{picture1; picture2; picture3}',
				'createcommand onething Dogs are $rand:{adorable; cute; sweet} aren\'t they?',
				'createcommand dogsorcats $rand:{Dogs; Cats} are $rand:{adorable; cute; sweet} aren\'t they?'
			],
			args: [
				{
					key: 'name',
					prompt: 'Please enter the desired name of the command.',
					type: 'string',
					parse: (str) => {
						return str.toLowerCase();
					}
				},
				{
					key: 'response',
					prompt: 'Please enter the desired response for the command.',
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
		if (args.name.includes(',') || args.name.includes('|')) return msg.reply(`The way commands are made has been redone. Please use ${msg.guild.commandPrefix}help createcommand for more information.`);
		customcommands[args.name] = {};
		customcommands[args.name].response = args.response;
		settings.customcommands = customcommands;
		await redis.db.setAsync(`customcommand${msg.guild.id}${args.name}`, args.response).catch(console.error);
		await settings.save().catch(console.error);
		return msg.reply(`A command \`${args.name}\` has been successfully created.`);
	}
};
