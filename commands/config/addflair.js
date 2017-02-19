const { Command } = require('discord.js-commando');

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
		const settings = msg.guild.settings.get('imroles', {});
		if (!settings.roles) settings.roles = [];
		if (settings.roles.includes(args.role.id)) return msg.reply(`${args.role.name} is already in the list of self-assignable roles.`);
		settings.roles.push(args.role.id);
		msg.guild.settings.set('imroles', settings);
		return msg.reply(`The role \`${args.role.name}\` has been successfully added to the list of self-assignable roles!`);
	}
};
