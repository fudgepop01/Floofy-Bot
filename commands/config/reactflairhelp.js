const { Command } = require('discord.js-commando');

module.exports = class ReactFlairHelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reactflairhelp',
			group: 'config',
			memberName: 'reactflairhelp',
			description: 'Details on how to set up self-assignable roles by reactions.'
		});
	}

	async run(msg) {
		return msg.embed({
			color: parseInt('cc0000', 16),
			title: 'How to set up self-flairing by Reactions for your server!',
			fields: [
				{
					name: 'How to use:',
					value: 'This system is very unique in the way it requires no typing whatsoever to receive a role, just assign an `emoji` to a `role` for people to react to!'
				},
				{
					name: '**Step 1**: Enable it!',
					value: 'In order to do this, type `togglereactflair enable`. You may disable this at any point in time.'
				},
				{
					name: '**Step 2**: Designate a channel!',
					value: 'In order to do this, type `reactflairchannel <channel>` in order to tell me where I should look for reactions! This is very important for backend reasons...!'
				},
				{
					name: '**Step 3**: Designate roles!',
					value: 'In order to do this, type `addreactflair <emoji> <role>`. Currently, I only offer support for **server-specific** emojis and global **unicode** characters, such as \u{2764}.'
				},
				{
					name: '\u200b',
					value: 'Here is a gif showcasing how this works! **waiting on fudge for gif**'
				}
			]
		});
	}
};
