const commando = require('discord.js-commando');

module.exports = class Distance extends commando.Command {
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
	async run(message, args) {
		let settings = this.client.provider.get(message.guild, 'imroles', {});
		settings.push(args.role);
		this.client.provider.set(message.guild.id, 'imroles', settings);
		return message.reply(`The word \`${args.role.name}\` has been successfully added to the list of self-assignable roles!`);
	}
};
