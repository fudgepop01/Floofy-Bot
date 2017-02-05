const commando = require('discord.js-commando');
const path = require('path');
const jsonfile = require('jsonfile');

module.exports = class Chat extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'loadsconfigs',
			group: 'test',
			memberName: 'loadsconfigs',
			description: 'Only use this once!'
		});
	}
	hasPermission(msg) {
		return msg.author.id === this.client.options.owner;
	}

	async run(message) {
		let bot = message.client;
		const r = require('rethinkdbdash')({ host: 'localhost', db: 'Config' });
		const table = r.table('guilds');
		bot.guilds.forEach(g => {
			// for every guild load a sconfig and fill to table
			table.get(g.id).run()
			.then(res => {
				let sconfig = jsonfile.readFileSync(path.join(__dirname, `../../config/server/${g.id}.json`));
				table.insert([
					sconfig
				], { conflict: 'replace' }).run()
				.catch(e => console.error(`error at ${g.id}`));
			});
		});
		let query = await r.table('guilds').get(message.guild.id).run();
		console.log(query);

		// test nonexistant guild entry to add to rethinkProvider, try to get guild info otherwise populate w new info
		// kurisus guild as a test
		// apparently goes to .then() , but the response is === null
		r.table('guilds').get('132368736119291904').run().then(s => console.log(s === null)).catch(e => console.error(e === null));
	}
};
