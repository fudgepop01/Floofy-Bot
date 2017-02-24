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
				Format is: \`.createcommand ,name response\`\n
				For responses with a random selection: \`.createcommand name response | item1; item2; item3\`\n
				To start with a random selection: \`.createcommand name | item1; item2; item3 | response\`
			`,
			examples: [
				'createcommand say hello',
				'createcommand randompicture | picture1; picture2; picture3',
				'createcommand onething Dogs are | adorable ; cute ; sweet | aren\'t they?',
				'createcommand dogsorcats | Dogs; Cats | are | adorable; cute; sweet | aren\'t they?'
			],
			args: [
				{
					key: 'name',
					prompt: 'Please enter the desired name of the command.',
					type: 'string'
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
		// if (!args.name.includes(',')) args.name = [args.name.slice(0, 0), ',', args.name.slice(0)].join('');
		if (args.name.includes(',')) args.name = args.name.replace(',', '').trim();
		args.response = args.response.split('|');
		customcommands[args.name] = {};
		customcommands[args.name].response = args.response;
		settings.customcommands = customcommands;
		await redis.db.setAsync(`customcommands${msg.guild.id}`, JSON.stringify(customcommands)).catch(console.error);
		await settings.save().catch(console.error);
		return msg.reply(`A command \`${args.name}\` has been successfully created.`);
	}
};
