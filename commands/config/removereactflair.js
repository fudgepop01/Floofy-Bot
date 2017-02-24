const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class RemoveReactFlairCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'removereactflair',
			group: 'config',
			memberName: 'removereactflair',
			description: 'Removes a role (with its emoji) from the list of self-assignable roles by reactions.',
			guildOnly: true,
			examples: [
				'removereactflair frens'
			],
			args: [
				{
					key: 'role',
					prompt: 'What role would you remove?\n',
					type: 'role'
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
		let reactions = settings.reactions;
		delete reactions[args.role.id];
		settings.reactions = reactions;
		await settings.save().catch(console.error);
		return msg.reply(`I have successfully removed ${args.role.name} from the list of self-assignable roles by reactions.`);
	}
};
