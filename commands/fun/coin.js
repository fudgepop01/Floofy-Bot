const commando = require('discord.js-commando');

module.exports = class Coin extends commando.Command {
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

	async run(message) {
		let res = `${Math.random() < 0.5 ? 'tails' : 'heads'}`;
		await message.channel.send(`${message.author} threw a coin: **${res}**!`);
		message.channel.sendFile(require('path').join(__dirname, `../../assets/coin/${res}r.png`));
	}
};
