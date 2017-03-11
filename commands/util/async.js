const escapeRegex = require('escape-string-regexp');
const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

module.exports = class AsyncEvalCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'async',
			group: 'util',
			memberName: 'async',
			description: 'Executes Asynchronous JavaScript code.',
			details: 'Only the bot owner(s) may use this command.',

			args: [
				{
					key: 'script',
					prompt: 'What code would you like to evaluate asyncronously?\n',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.options.owner === msg.author.id;
	}

	async run(msg, args) {
		const time = new Date().getTime();
		try {
			let evaled;
			evaled = eval(`(async()=>{${args.script}})();`);
			if (evaled instanceof Promise) {
				if (msg.cmd === 'eval') await evaled;
				else evaled = await evaled;
			}
			const responseTypeof = typeof evaled;
			if (typeof evaled !== 'string') {
				evaled = require('util').inspect(evaled, false, 0);
			}
			if (this.sensitivePattern.test(evaled)) {
				msg.say(':P');
				return;
			}
			await msg.say(stripIndents`
				**INPUT** 📥
				\`\`\`js
				${args.script}
				\`\`\`
				**TYPE** 🔧 *${responseTypeof}*

				**OUTPUT** 📤
				\`\`\`js
				${evaled}
				\`\`\`*Time taken: ${new Date().getTime() - time}\ms*`);
		} catch (err) {
			msg.say(stripIndents`${msg.content}
				\`ERROR\`
				\`\`\`js
				${err}${err.response && err.response.res && err.response.res.text ? `\n${err.response.res.text}` : ''}
				\`\`\`
				Time taken: \`${new Date().getTime() - time}\` ms
				`)
				.catch(console.error);
		}
		await msg.delete();
	}


	get	sensitivePattern() {
		if (!this._sensitivePattern) {
			const client = this.client;
			let pattern = '';
			if (client.token) pattern += escapeRegex(client.token);
			if (client.email) pattern += (pattern.length > 0 ? '|' : '') + escapeRegex(client.email);
			if (client.password) pattern += (pattern.length > 0 ? '|' : '') + escapeRegex(client.password);
			Object.defineProperty(this, '_sensitivePattern', { value: new RegExp(pattern, 'gi') });
		}
		return this._sensitivePattern;
	}
};
