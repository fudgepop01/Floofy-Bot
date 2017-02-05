const commando = require('discord.js-commando');

module.exports = class EightBall extends commando.Command {
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

	async run(message, args) {
		const responses = ['Nope', "I don't know, m8", 'Hell naw', 'Most likely', 'Without a doubt! \u2764\uFE0F', 'Yes, definitely! \uD83D\uDE04', 'Most likely!', 'Doubtful...', 'YES YES YES!', 'In your dreams!', 'You already know the answer to that...', 'Oh god, no.', "If that's what you want..."];
		return message.channel.send(`\uD83C\uDFB1${message.author} asked \`${args.question}\`\nResponse: ${responses[Math.floor(Math.random() * responses.length)]}`);
	}
};
