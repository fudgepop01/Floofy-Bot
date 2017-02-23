const { Command } = require('discord.js-commando');
const beautify = require('js-beautify').js_beautify;

module.exports = class BeautifyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'beautify',
			group: 'util',
			memberName: 'beautify',
			description: 'Beautifies javascript code.',
			guildOnly: true
		});
	}

	async run(msg) {
		msg.say('Searching for code to beautify...').then(message => {
			format(message).then(res => message.edit(res));
		});
	}
};

function format(msg) {
	return new Promise((resolve, reject) => {
		let messages = msg.channel.messages.array().reverse();
		let code;
		let codeRegex = /```(?:js|json|javascript)?\n?((?:\n|.)+?)\n?```/ig;

		for (let me = 0; me < messages.length; me++) {
			const msg1 = messages[me];
			const groups = codeRegex.exec(msg1.content);

			if (groups && groups[1].length) {
				code = groups[1];
				break;
			}
		}

		if (!code) {
			reject('No Javascript codeblock found.');
		}

		let beautifiedCode = beautify(code, { indent_size: 2, brace_style: 'collapse' }); // eslint-disable-line camelcase
		resolve(reduceIndentation(beautifiedCode).then(str => `${'```js'}\n${str}\n${'```'}`));
	});
}

function reduceIndentation(string) {
	return new Promise((resolve) => {
		let whitespace = string.match(/^(\s+)/);
		if (!whitespace) resolve(string);

		whitespace = whitespace[0].replace('\n', '');

		let lines = string.split('\n');
		let reformattedLines = [];

		lines.forEach(line => reformattedLines.push(line.replace(whitespace, '')));
		resolve(reformattedLines.join('\n'));
	});
}
