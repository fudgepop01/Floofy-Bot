const commando = require('discord.js-commando');

module.exports = class Distance extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'temperature',
			group: 'fun',
			aliases: ['temp'],
			memberName: 'temperature',
			description: 'Calculate temperature between C & F.',
			details: `Calculate temperature between C & F.`,
			examples: ['temperature 69 C', 'temperature 42 F'],

			args: [
				{
					key: 'temperature',
					prompt: 'Please enter a temperature!',
					type: 'integer'
				},
				{
					key: 'unit',
					prompt: 'Please enter a unit!',
					type: 'string'
				}
			]
		});
	}

	async run(message, args) {
		if (args.unit === 'c' || args.unit === 'celsius') {
			let newtemp = args.temperature * 9 / 5 + 32;
			return message.channel.sendMessage(`${Math.round(newtemp * 100) / 100} Degrees Fahrenheit`);
		}
		else if (args.unit === 'f' || args.unit === 'fahrenheit') {
			let newtemp = (args.temperature - 32) * 5 / 9;
			return message.channel.sendMessage(`${Math.round(newtemp * 100) / 100} Degrees Celsius`);
		}
		else {
			return message.channel.send('Please provide either C or F for me to convert.'); }
	}
};
