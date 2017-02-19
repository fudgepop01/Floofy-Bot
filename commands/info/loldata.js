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

	async run(message, args) {
		let name = encodeURIComponent(args.user.toLowerCase());
		const summoner = await request(`https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/${name}?api_key=${lol}`).catch(() => null);
		if (!summoner) return message.reply('Could not find a summoner with this name!');
		let summonerId = summoner.body[name].id;
		let summonerName = summoner.body[name].name;
		const summary = await request(`https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/${summonerId}/summary?season=SEASON2017&api_key=${lol}`);
		let wins = 0, champKills = 0, assists = 0, minionKills = 0, turretKills = 0;
		summary.body.playerStatSummaries.forEach(stat => {
			if (stat.aggregatedStats.totalChampionKills) {
				wins += stat.wins;
				champKills += stat.aggregatedStats.totalChampionKills;
				assists += stat.aggregatedStats.totalAssists;
				turretKills += stat.aggregatedStats.totalTurretsKilled;
				if (stat.aggregatedStats.totalMinionKills) minionKills += stat.aggregatedStats.totalMinionKills;
			}
		});

		let canvas = new Canvas(800, 250);
		let ctx = canvas.getContext('2d');

		let Image = Canvas.Image;
		let lolbg = new Image();
		lolbg.src = path.join(__dirname, '..', '..', 'assets', 'lol', 'bg.png');
		ctx.globalAlpha = 0.65;
		ctx.drawImage(lolbg, 0, 0);
		ctx.globalAlpha = 0.65;

		ctx.globalAlpha = 0.70;
		ctx.fillStyle = '#545454';
		ctx.fillRect(0, 0, canvas.width, 75);
		ctx.globalAlpha = 1;

		ctx.fillStyle = '#cccccc';
		ctx.font = '40px Arial';
		ctx.fillText(summonerName, 100, 50);

		ctx.fillStyle = '#cccccc';
		ctx.font = '30px Arial';
		ctx.fillText('Wins', 60, 225);

		ctx.fillStyle = '#cccccc';
		ctx.font = '30px Arial';
		ctx.fillText('Kills', 225, 225);

		ctx.fillStyle = '#cccccc';
		ctx.font = '30px Arial';
		ctx.fillText('Assists', 350, 225);

		ctx.fillStyle = '#cccccc';
		ctx.font = '30px Arial';
		ctx.fillText('CS', 540, 225);

		ctx.fillStyle = '#cccccc';
		ctx.font = '30px Arial';
		ctx.fillText('Turrets', 685, 225);

		ctx.fillStyle = '#cccccc';
		ctx.font = '30px Arial';
		ctx.fillText(wins, 60, 150);

		ctx.fillStyle = '#cccccc';
		ctx.font = '30px Arial';
		ctx.fillText(champKills, 210, 150);

		ctx.fillStyle = '#cccccc';
		ctx.font = '30px Arial';
		ctx.fillText(assists, 360, 150);

		ctx.fillStyle = '#cccccc';
		ctx.font = '30px Arial';
		ctx.fillText(minionKills, 535, 150);

		ctx.fillStyle = '#cccccc';
		ctx.font = '30px Arial';
		ctx.fillText(turretKills, 685, 150);

		return message.channel.sendFile(canvas.toBuffer());
	}
};
