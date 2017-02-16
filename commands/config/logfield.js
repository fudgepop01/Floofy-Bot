const { Command } = require('discord.js-commando');
const fields = ['nicknames', 'roles', 'usernames', 'joins', 'leaves', 'bans', 'avatars', 'messages'];

module.exports = class LogFieldToggleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'logfield',
			group: 'config',
			memberName: 'logfield',
			description: 'Enables or disables a field for logging.',
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
						if (fields.includes(field)) return `Please input a valid field. The options are: ${fields.join(', ')}`;
						return true;
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
