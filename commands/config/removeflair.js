const commando = require('discord.js-commando');

module.exports = class Distance extends commando.Command {
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
	async run(message, args) {
		let settings = this.client.provider.get(message.guild, 'imroles', {});
		settings.splice(settings.indexOf(args.name));
		this.client.provider.set(message.guild.id, 'imroles', settings);
		return message.reply(`The word \`${args.role.name}\` has been successfully removed from the list of self-assignable roles!`);
	}
};
