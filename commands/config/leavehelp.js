const { Command } = require('discord.js-commando');

module.exports = class LeaveHelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leavehelp',
			group: 'config',
			memberName: 'leavehelp',
			description: 'Details on how to set up leave messages'
		});
	}

	async run(msg) {
		return msg.embed({
			color: parseInt('cc0000', 16),
			title: 'How to set up leave messages for your server!',
			fields: [
				{
					name: '**Step 1**: Set a leave message for new members',
					value: 'In order to do this, type `leavemessage <message>`, where `<message>` is what the user will see when they join. In order to include a user mention. type `[user]` where the mention would go. If I picked this up, I will say `USER` in the feedback.'
				},
				{
					name: '**Step 2**: Provide a channel',
					value: 'Type `leavechannel <channel>` to give the leave message a place to go.'
				},
				{
					name: '**Step 3**: Enable it',
					value: 'In order to do this, type in `toggleleave enable` to enable leave messages. You can disable this at any point in time, just use `disable` instead of `enable`.'
				}
			]
		});
	}
};
