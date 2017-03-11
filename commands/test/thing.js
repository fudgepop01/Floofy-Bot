const { Command } = require('discord.js-commando');

module.exports = class LoadConfigsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'thing',
			group: 'test',
			memberName: 'thing',
			description: 'Experimenting with defining methods'
		});
	}

	hasPermission(msg) {
		return msg.author.id === this.client.options.owner;
	}

	async run(message) {
		Object.defineProperty(
			this.client, 'oneMessage',
			{
				writable: false, enumerable: false, configurable: false,
				value: function(location, filter, time) {
					return location.awaitMessages(filter, { max: 1, time: time, errors: ['time'] });
				}
			});
		// you can call this after the code above has been defined
		const filter = m => m.content.startsWith('test');
		this.client.oneMessage(message.channel, filter, 5000).then(console.log).catch(console.error);
	}
};
