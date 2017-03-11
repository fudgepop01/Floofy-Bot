const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class RemoveFlairCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'removeflair',
			group: 'config',
			memberName: 'removeflair',
			description: 'Removes a role from the list of self-assignable roles.',
			guildOnly: true,
			examples: [
				'removeflair frens'
			],
			args: [
				{
					key: 'role',
					prompt: 'What role would you like to remove from the list of self-assignable roles?\n',
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
		if (!settings.flairs.roles) return msg.reply('there are no self-assignable roles on the list.');
		if (!settings.flairs.roles.includes(args.role.id)) return msg.reply(`${args.role.name} is not in the list of self-assignable roles.`);
		let flairs = settings.flairs;
		settings.flairs.roles.splice(settings.flairs.roles.indexOf(args.role.id));
		settings.flairs = flairs;
		await settings.save().catch(console.error);
		return msg.reply(`The role \`${args.role.name}\` has been successfully removed from the list of self-assignable roles!`);
	}
};
