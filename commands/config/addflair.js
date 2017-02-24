const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class AddFlairCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'addflair',
			group: 'config',
			memberName: 'addflair',
			description: 'Adds a role to the list of self-assignable roles.',
			guildOnly: true,
			examples: [
				'addflair frens'
			],
			args: [
				{
					key: 'role',
					prompt: 'What role would you like to add to the list of self-assignable roles?\n',
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
		let flairs = settings.flairs;
		if (!flairs.roles) settings.roles = [];
		if (flairs.roles.includes(args.role.id)) return msg.reply(`${args.role.name} is already in the list of self-assignable roles.`);
		flairs.roles.push(args.role.id);
		settings.flairs = flairs;
		await settings.save().catch(console.error);
		return msg.reply(`The role \`${args.role.name}\` has been successfully added to the list of self-assignable roles!`);
	}
};
