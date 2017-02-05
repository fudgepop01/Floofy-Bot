const commando = require('discord.js-commando');

module.exports = class Distance extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'distance',
			group: 'fun',
			aliases: ['dist'],
			memberName: 'distance',
			description: 'Calculate distance between mi & km.',
			details: `Calculate a distance between mi & km.`,
			examples: ['distance 69 km', 'distance 42 mi'],

			args: [
				{
					key: 'distance',
					prompt: 'Please enter a number!',
					type: 'integer'
				},
				{
					key: 'unit',
					prompt: 'Please enter a distance!',
					type: 'string'
				}
			]
		});
	}

	async run(message, args) {
		if (args.unit === 'mi') return message.channel.sendMessage(`${Math.round((args.distance * 1.609) * 100) / 100} kilometers`);
		else if (args.unit === 'km')	return message.channel.sendMessage(`${Math.round((args.distance * 0.62137119) * 100) / 100} miles`);
		else return message.channel.send('Please provide either km or mi for me to convert!');
	}
};
