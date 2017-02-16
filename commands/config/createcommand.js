const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

// const Settings = require('../../dataProviders/rethonk');

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
		const settings = this.client.provider.get(msg.guild, 'customcommands', {});
		if (!args.name.includes(',')) args.name = [args.name.slice(0, 0), ',', args.name.slice(0)].join('');
		args.response = args.response.split('|');
		settings[args.name] = {};
		settings[args.name].response = args.response;
		this.client.provider.set(msg.guild.id, 'customcommands', settings);
		return msg.reply(`A command \`${args.name}\` has been successfully created.`);
	}
};
