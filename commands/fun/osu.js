const { Command } = require('discord.js-commando');
const config = require('../../settings');
const osu = require('osu')(config.osu);

module.exports = class OsuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'osu',
			group: 'fun',
			memberName: 'osu',
			description: 'Retrieve an osu! profile.',

			args: [
				{
					key: 'user',
					prompt: 'Whose osu! profile would you like to view?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const url = 'https://osu.ppy.sh/u/';
		osu.get_user({
			u: args.user,
			type: 'string',
			event_days: 31
		}, (result) => {
			if (!result[0]) msg.channel.send('Invalid username!');
			else msg.channel.send(`User info of ${result[0].username}:\nLevel: ${result[0].level}\nPP Rank: ${result[0].pp_rank}\nPlay count: ${result[0].playcount}\nProfile: <${url}${result[0].username}>`);
		});
	}
};
