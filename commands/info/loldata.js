const { Command } = require('discord.js-commando');
const request = require('superagent');
const Canvas = require('canvas');
const { lol } = require('../../settings');
const path = require('path');

module.exports = class LoLProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'loldata',
			group: 'info',
			memberName: 'loldata',
			description: 'Get a user\'s League of Legends Profile Summary',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 15
			},
			args: [
				{
					key: 'user',
					prompt: 'What user would you like to have information on?\n',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.options.owner === msg.author.id;
	}

	async run(message, args) {
		// https://developer.riotgames.com/discussion/community-discussion/show/WE5hFjqw
		let name = encodeURIComponent(args.user.toLowerCase());
		const summoner = await request(`https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/${name}?api_key=${lol}`).catch(() => null);
		if (!summoner) return message.reply('Could not find a summoner with this name!');
		let summonerId = summoner.body[name].id;
		let summonerName = summoner.body[name].name;
		const avatar = require('request-promise').defaults({ encoding: null })(`http://avatar.leagueoflegends.com/na/${summonerName}.png`).catch(() => null);

		// http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/Aatrox.png
		// https://global.api.pvp.net/api/lol/static-data/na/v1.2/versions  <- get latest version

		const embed = new this.client.methods.Embed()
			.setThumbnail(avatar);
		return message.channel.sendEmbed(embed);
	}

	get ChampionInfo() {
		(async() => {
			const topThreeChampions = await request(`https://na.api.pvp.net/championmastery/location/NA1/player/34050271/topchampions?api_key=&api_key=${lol}`);
			const champIds = topThreeChampions.map(champion => champion.championId);
			champIds.forEach(async id => {
				await request(`https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/${id}?api_key=${lol}`);
			});
			return this.champions;
		})();
	}
};
