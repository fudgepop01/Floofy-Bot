const commando = require('discord.js-commando');
const config = require('../../settings');
const wolfram = require('wolfram-alpha').createClient(config.wolfram);
const math = require('mathjs');

module.exports = class Distance extends commando.Command {
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

	async run(message, args) {
	  let out = `${message.author} asked \` ${args.query}\`\n`;

	  try {
	    message.channel.send(out + math.eval(args.query)).catch(() => {});
	  }
	  catch (err) {
	    message.channel.startTyping();
	    wolfram.query(args.query, (err, results) => {
	      if (err) {
	        console.log(err);
	        message.channel.sendMessage('There was an error processing your request (call limit reached most likely)!').then(msg => message.channel.stopTyping(true));
	      }
	      else if (!results) return message.channel.sendMessage('No results!').catch(() => {});
	      else {
	        let noExact = true;
	        for (let i = 0; i < results.length; i++) {
	          if (results[i].title == 'Exact result') {
	            out += mathEval(results[i].subpods[0].text);
	            noExact = false;
	          }
	        }
	        if (noExact) {
	          out += mathEval(results[0].subpods[0].text);
	        }
	        return message.channel.send(out).then(msg => message.channel.stopTyping(true)).catch(() => {});
	      }
	    });
	  }
	}
}
function mathEval(expression) {
  // http://www.javascripter.net/faq/mathsymbols.htm
  expression = expression.replace(/integral/, '\u222B');
  return expression;
}
