const { Command } = require('discord.js-commando');
const fields = ['nicknames', 'roles', 'usernames', 'joins', 'leaves', 'bans', 'avatars', 'messages'];

module.exports = class LogFieldToggleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'logfield',
			group: 'config',
			memberName: 'logfield',
			description: 'Adds an emoji and a role to the list of self-assignable roles by reactions.',
			guildOnly: true,
			examples: [
				'logfield avatars disable'
			],
			args: [
				{
					key: 'field',
					prompt: 'What field would you like to toggle?\n',
					type: 'string',
					validate: field => {
						return fields.includes(field);
					},
					parse: field => {
						return fields[field];
					}
				},
				{
					key: 'enabled',
					prompt: 'Would you like for this to be enabled? (Yes or No)\n',
					type: 'boolean'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(msg, args) {
		let logs = msg.client.provider.get(msg.guild, 'logs', {});
		logs[args.field] = args.enabled;
		msg.client.provider.set(msg.guild, 'logs', logs);
		return msg.reply(`I have ${args.enabled ? 'enabled' : 'disabled'} the logging of ${args.field}.`);
	}
};
