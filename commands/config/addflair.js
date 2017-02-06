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
		const settings = this.client.provider.get(msg.guild, 'imroles', {});
		settings.push(args.role);
		this.client.provider.set(msg.guild.id, 'imroles', settings);
		return msg.reply(`The role \`${args.role.name}\` has been successfully added to the list of self-assignable roles!`);
	}
};
