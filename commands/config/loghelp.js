const { Command } = require('discord.js-commando');

module.exports = class WelcomeHelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'loghelp',
			alises: ['logshelp', 'logginghelp'],
			group: 'config',
			memberName: 'loghelp',
			description: 'Details on how to set up logging.'
		});
	}

	async run(msg) {
		return msg.embed({
			color: parseInt('cc0000', 16),
			title: 'How to set up logs for your server!',
			fields: [
				{
					name: '**Step 1**: Provide a channel',
					value: 'Logs need someplace to go, don\'t they? Type in `logchannel <channel>` to give the logs a place to go. Usually this kind of channel is kept private.'
				},
				{
					name: '**Step 2**: Customize it',
					value: 'If you want to disable the logging of certain things, such as avatars, type in `logfield <field> disable.`'
				},
				{
					name: '**Step 3**: Enable it',
					value: 'In order to do this, type in `togglelogs enable` to enable logs. You can disable this at any point in time, just use `disable` instead of `enable`.'
				}
			]
		});
	}
};
