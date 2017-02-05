const { Command } = require('discord.js-commando');
const config = require('../../settings');
const wolfram = require('wolfram-alpha').createClient(config.wolfram);
const math = require('mathjs');

module.exports = class WolframCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wfa',
			group: 'fun',
			aliases: ['wolfram', 'wolframalpha'],
			memberName: 'wfa',
			description: 'Compute an expression via the WolframAlpha computational search engine.',
			details: 'Might not work with all queries becuase the API is shit.',
			examples: ['wfa integral of 2x from 0 to 2', 'wfa 69 * 420'],

			args: [
				{
					key: 'query',
					prompt: 'What would you like to compute?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) { // eslint-disable-line consistent-return
		let out = `${msg.author} asked \` ${args.query}\`\n`;

		try {
			return msg.say(out + math.eval(args.query));
		} catch (err) {
			msg.channel.startTyping();
			wolfram.query(args.query, (error, results) => {
				if (error) {
					console.log(error);
					msg.say('There was an error processing your request (call limit reached most likely)!')
						.then(() => msg.channel.stopTyping(true));
				}
				if (!results) return msg.say('No results!');
				let noExact = true;
				for (let i = 0; i < results.length; i++) {
					if (results[i].title === 'Exact result') {
						out += this.mathEval(results[i].subpods[0].text);
						noExact = false;
					}
				}
				if (noExact) {
					out += this.mathEval(results[0].subpods[0].text);
				}
				return msg.say(out).then(() => msg.channel.stopTyping(true));
			});
		}
	}

	mathEval(expression) {
		// http://www.javascripter.net/faq/mathsymbols.htm
		expression = expression.replace(/integral/, '\u222B');
		return expression;
	}
};
