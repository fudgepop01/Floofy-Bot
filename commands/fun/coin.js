const { Command } = require('discord.js-commando');

module.exports = class CoinFlipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'coin',
			group: 'fun',
			memberName: 'coin',
			description: 'Flip a coin!',
			details: `Flip me!`,
			examples: ['coin']
		});
	}

	async run(msg) {
		const res = `${Math.random() < 0.5 ? 'tails' : 'heads'}`;
		await msg.say(`${msg.author} threw a coin: **${res}**!`);
		msg.channel.sendFile(require('path').join(__dirname, `../../assets/coin/${res}r.png`));
	}
};
