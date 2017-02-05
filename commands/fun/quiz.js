const { Command } = require('discord.js-commando');
const fs = require('fs');
const path = require('path');

// const config = require('../../settings');

module.exports = class QuizCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'quiz',
			group: 'fun',
			memberName: 'quiz',
			description: 'Sends a random question an expects a correct answer.'
		});
	}

	async run(msg) {
		const quiz = await JSON.parse(fs.readFileSync(path.join(__dirname, '../../assets/quiz/quiz.json'), 'utf-8'));
		// jsonfile.readFile(path.join(__dirname, '../../config/user/uconfig.json'), (err, data) => {
		const item = quiz[Math.floor(Math.random() * quiz.length)];
		msg.say(item.q)
			.then(() => {
				msg.channel.awaitMessages(answer => item.a.join('|').toLowerCase().includes(answer.content.toLowerCase()), {
					max: 1,
					time: 30000,
					errors: ['time']
				})
					.then((collected) => {
						/* let user = collected.first().author.id;
						if (!uconfig[user]) uconfig[user] = {};
						if (!uconfig[user].points) { uconfig[user].points = 100; }
						uconfig[user].points += 10;
						jsonfile.writeFileSync(path.join(__dirname, '../../config/user/uconfig.json'), uconfig, { spaces: 4 });*/
						msg.say(`We have a winner! *${collected.first().author.username}* had a right answer with \`${collected.first().content}\`!\n10 points have bene awarded!`);
						// make dougnut currency system instead?
					})
					.catch(() => {
						msg.say('Seems no one got it! Oh well.');
					});
			}).catch(error => msg.say(error.text));
	}
};
