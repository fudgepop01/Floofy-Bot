const { Command } = require('discord.js-commando');

module.exports = class TemperatureCommand extends Command {
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

	async run(msg, args) {
		const temp = args.temperature;
		const unit = args.unit;
		if ((unit === 'c') || (unit === 'celsius')) {
			const newtemp = ((temp * 9) / 5) + 32;
			return msg.say(`${Math.round(newtemp * 100) / 100} Degrees Fahrenheit`);
		}
		if (args.unit === 'f' || args.unit === 'fahrenheit') {
			const newtemp = (temp - 32) * 5 / 9;
			return msg.say(`${Math.round(newtemp * 100) / 100} Degrees Celsius`);
		}
		return msg.say('Please provide either C or F for me to convert.');
	}
};
