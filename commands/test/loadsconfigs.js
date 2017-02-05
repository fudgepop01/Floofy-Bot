const { Command } = require('discord.js-commando');
const rethink = require('rethinkdbdash')({ host: 'localhost', db: 'Config' });
const path = require('path');
const jsonfile = require('jsonfile');

module.exports = class LoadConfigsCommand extends Command {
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
		const table = rethink.table('guilds');
		this.client.guilds.forEach(guild => {
			// for every guild load a sconfig and fill to table
			table.get(guild.id).run()
			.then(() => {
				let sconfig = jsonfile.readFileSync(path.join(__dirname, `../../config/server/${guild.id}.json`));
				table.insert([sconfig], { conflict: 'replace' }).run()
					.catch(() => console.error(`error at ${guild.id}`));
			});
		});
		const query = await rethink.table('guilds').get(message.guild.id).run();
		console.log(query);
		// test nonexistant guild entry to add to rethinkProvider, try to get guild info otherwise populate w new info
		// kurisus guild as a test
		// apparently goes to .then() , but the response is === null
		rethink.table('guilds').get('132368736119291904').run()
			.then(res => console.log(res === null))
			.catch(error => console.error(error === null));
	}
};
