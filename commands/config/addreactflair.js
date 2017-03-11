const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class AddReactFlairCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'addreactflair',
			group: 'config',
			memberName: 'addreactflair',
			description: 'Adds an emoji and a role to the list of self-assignable roles by reactions.',
			guildOnly: true,
			examples: [
				'addreactflair \u{1f609} frens'
			],
			args: [
				{
					key: 'emoji',
					prompt: 'What emoji would you like to add to the list of self-assignable reactions?\n',
					type: 'emoji'
				},
				{
					key: 'role',
					prompt: 'What role would you like to attach to the emoji?\n',
					type: 'role'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(msg, args) {
		const settings = await guildSettings.findOne({ where: { guildID: msg.guild.id } }) || await guildSettings.create({ guildID: msg.guild.id });
		let reactions = settings.reactions;
		if (!reactions.roles) reactions.roles = [];
		if (!reactions.emojis) reactions.emojis = [];
		reactions.roles.push(args.role.id);
		reactions.emojis.push(args.emoji.hasOwnProperty('id') ? args.emoji.id : args.emoji);
		settings.reactions = reactions;
		await settings.save().catch(console.error);
		return msg.reply(`I have successfully added ${args.role.name} and ${args.emoji} to the list of self-assignable roles by reactions.`);
	}
};
