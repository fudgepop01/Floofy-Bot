const { Command } = require('discord.js-commando');
const beautify = require('js-beautify').js_beautify;

module.exports = class LaunchCybernukeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'beautify',
			group: 'util',
			memberName: 'beautify',
			description: 'Beautifies javascript code.',
			guildOnly: true
		});
	}

	async run(message, args) {
		function format(msg) {
			return new Promise((resolve, reject) => {
				// let messages = message.channel.messages.array().reverse().filter(msg => msg.author.id !== msg.client.user.id);
				let messages = message.channel.messages.array().reverse();
				let code;
				let codeRegex = /```(?:js|json|javascript)?\n?((?:\n|.)+?)\n?```/ig;

				for (let m = 0; m < messages.length; m++) {
					let msg = messages[m];
					let groups = codeRegex.exec(msg.content);

					if (groups && groups[1].length) {
						code = groups[1];
						break;
					}
				}

				if (!code) {
					reject('No Javascript codeblock found.');
				}

				let beautifiedCode = beautify(code, { indent_size: 2, brace_style: 'collapse' });
				resolve(reduceIndentation(beautifiedCode).then(str => `${'```js'}\n${str}\n${'```'}`));
			});
		}
		message.channel.sendMessage('Searching for code to beautify...').then(msg => {
			format(msg).then(res => msg.edit(res));
		});
	}
};
function reduceIndentation(string) {
	return new Promise((resolve, reject) => {
		let whitespace = string.match(/^(\s+)/);
		if (!whitespace) resolve(string);

		whitespace = whitespace[0].replace('\n', '');

		let lines = string.split('\n');
		let reformattedLines = [];

		lines.forEach(line => reformattedLines.push(line.replace(whitespace, '')));
		resolve(reformattedLines.join('\n'));
	});
}
