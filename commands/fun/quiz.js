const { Command } = require('discord.js-commando');
const Currency = require('../../currency/Currency');
const { stripIndents } = require('common-tags');
const fs = require('fs');
const path = require('path');
const winston = require('../../structures/Logger.js');

module.exports = class QuizCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'quiz',
			group: 'fun',
			memberName: 'quiz',
			description: 'Sends a random question an expects a correct answer.'
		});

		this.quizzes = new Map();
	}

	async run(msg) {
		if (this.quizzes.has(msg.guild.id)) return msg.reply('please finish the current quiz before attempting to start a new one.');
		const quiz = await JSON.parse(fs.readFileSync(path.join(__dirname, '../../assets/quiz/quiz.json'), 'utf-8'));
		const item = quiz[Math.floor(Math.random() * quiz.length)];
		msg.say(item.q)
			.then(async () => {
				this.quizzes.set(msg.guild.id, true);
				msg.channel.awaitMessages(answer => item.a.join('|').toLowerCase().includes(answer.content.toLowerCase()), {
					max: 1,
					time: 30000,
					errors: ['time']
				})
					.then((collected) => {
						this.quizzes.delete(msg.guild.id);
						const message = collected.first();
						const winner = message.author;
						Currency.changeBalance(message.author.id, 10);
						msg.say(stripIndents`
							We have a winner! *${winner.username}* had a right answer with \`${message.content}\`!
							10 ${Currency.plural} have been awarded!
						`);
					})
					.catch(() => {
						this.quizzes.delete(msg.guild.id);
						msg.say('Seems no one got it! Oh well.');
					});
			}).catch(error => winston.error(error.text));
	}
};
