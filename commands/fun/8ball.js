const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

const responses = [
	'Nope',
	'I don\'t know, m8',
	'Hell naw',
	'Most likely',
	'Without a doubt!\u2764\uFE0F',
	'Yes, definitely! \uD83D\uDE04',
	'Most likely!',
	'Doubtful...',
	'YES YES YES!',
	'In your dreams!',
	'You already know the answer to that...',
	'Oh god, no.',
	'If that\'s what you want...'
];

module.exports = class EightBallCommand extends Command {
	constructor(client) {
		super(client, {
			name: '8ball',
			group: 'fun',
			memberName: '8ball',
			description: 'Ask question and receive a random answer.',
			details: `Ask a question and I will respond with a random anwer!`,
			examples: ['8ball Do you love me?'],

			args: [
				{
					key: 'question',
					prompt: 'ask me a question! Don\'t be shy...',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		return msg.say(stripIndents`
			🎱 ${msg.author} asked \`${args.question}\`
			Response: ${responses[Math.floor(Math.random() * responses.length)]}
		`);
	}
};
