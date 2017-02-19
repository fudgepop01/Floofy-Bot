const { Command } = require('discord.js-commando');

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
		const settings = msg.guild.settings.get('imroles', {});
		if (!settings.roles.includes(args.role.id)) return msg.reply(`${args.role.name} is not in the list of self-assignable roles.`);
		settings.roles.splice(settings.roles.indexOf(args.role.id));
		msg.guild.settings.set('imroles', settings);
		return msg.reply(`The role \`${args.role.name}\` has been successfully removed from the list of self-assignable roles!`);
	}
};
