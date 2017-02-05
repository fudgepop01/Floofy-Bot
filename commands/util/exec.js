const { Command } = require('discord.js-commando');
const childProcess = require('child_process');

module.exports = class LaunchCybernukeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'exec',
			aliases: ['execute'],
			group: 'util',
			memberName: 'exec',
			description: 'Executes command in the shell.',
			guildOnly: true,

			args: [
				{
					key: 'code',
					prompt: 'what would you like to execute?\n',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.options.owner === msg.author.id;
	}

	async run(message, args) {
		childProcess.exec(args.code, { shell: '/bin/bash' }, (err, stdout, stderr) => {
			if (err) return message.channel.sendCode('', err.message);
			return message.channel.send(stdout, { code: true });
		});
	}
};
