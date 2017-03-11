const { Command } = require('discord.js-commando');
const config = require('../../settings');
const request = require('request-promise');
const Canvas = require('canvas');
const path = require('path');

module.exports = class OsuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'osu',
			group: 'info',
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
		const options = {
			uri: 'https://osu.ppy.sh/api/get_user',
			headers: { 'User-Agent': `Floofy Bot v${config.version}` },
			qs: { k: config.osu, u: args.user }, json: true // eslint-disable-line
		};
		const res = await request(options).catch(err => console.error);
		if (!res) return msg.reply('I could not find anyone under that username.');
		const user = res[0];
		if (!user) return msg.reply('I could not find anyone under that username.');

		Canvas.registerFont(path.join(__dirname, '..', '..', 'assets', 'osu', 'fonts', 'exo2bold.ttf'), { family: 'exo2bold' });
		Canvas.registerFont(path.join(__dirname, '..', '..', 'assets', 'osu', 'fonts', 'exo2medium.ttf'), { family: 'exo2medium' });
		Canvas.registerFont(path.join(__dirname, '..', '..', 'assets', 'osu', 'fonts', 'exo2regular.ttf'), { family: 'exo2regular' });
		Canvas.registerFont(path.join(__dirname, '..', '..', 'assets', 'osu', 'fonts', 'osu!font.ttf'), { family: 'osu!font' });

		let canvas = new Canvas(700, 300);
		let ctx = canvas.getContext('2d');
		let x, y, w, h; // eslint-disable-line

		ctx.globalAlpha = 0.70;
		ctx.fillStyle = '#545454';
		ctx.fillRect(0, 0, canvas.width, 75);

		const background = new Canvas.Image();
		background.src = path.join(__dirname, '..', '..', 'assets', 'osu', 'background.png');
		ctx.globalAlpha = 0.3;
		ctx.drawImage(background, 0, 0, canvas.width, 300);

		const bgGradient = ctx.createLinearGradient(0, 0, 0, 170);
		bgGradient.addColorStop(0, '#318CE7');
		bgGradient.addColorStop(1, '#54626F');
		ctx.fillStyle = bgGradient;
		ctx.globalAlpha = 0.2;
		ctx.fillRect(0, 0, canvas.width, 90);

		const topBG = new Canvas.Image();
		ctx.globalAlpha = 0.08;
		topBG.src = path.join(__dirname, '..', '..', 'assets', 'osu', 'img', 'triangles_all.png');
		ctx.drawImage(topBG, 0, 0, canvas.width, 90);

		const avatar = new Canvas.Image();
		ctx.globalAlpha = 0.8;
		const avatarRes = await request.defaults({ encoding: null })(`http://a.ppy.sh/${user.user_id}`).catch(() => null);
		avatar.src = avatarRes;
		x = 12; y = 10; w = 70; h = 70; // eslint-disable-line
		ctx.rect(x, y, w, h);
		ctx.stroke();
		ctx.fillStyle = 'white';
		avatarRes ? ctx.drawImage(avatar, x, y, w, h) : ctx.fillRect(x, y, w, h); // eslint-disable-line

		const region = new Canvas.Image();
		ctx.globalAlpha = 1;
		region.src = path.join(__dirname, '..', '..', 'assets', 'osu', 'flags', `${user.country.toUpperCase()}.png`);
		x = 57, y = 10, w = 25, h = 17; // eslint-disable-line
		ctx.drawImage(region, x, y, w, h);
		ctx.rect(x, y, w, h);
		ctx.stroke();
		ctx.strokeStyle = '#cccccc';
		ctx.lineWidth = 1;

		ctx.fillStyle = '#cccccc';
		ctx.font = '50px exo2bold';
		ctx.maxLength = 20;
		ctx.textAlign = 'start';
		ctx.fillText(truncateText(ctx, user.username, 300), 90, 60);

		ctx.fillStyle = '#cccccc';
		ctx.font = '15px exo2regular';
		ctx.textAlign = 'start';
		ctx.fillText(`PP #${formatCommas(user.pp_rank)} (#${formatCommas(user.pp_country_rank)})`, 90, 80);

		ctx.fillStyle = '#cccccc';
		ctx.textAlign = 'start';
		ctx.font = '25px osu!font';
		ctx.fillText('Ranked Score', 50, 120);

		ctx.fillStyle = '#cccccc';
		ctx.font = '25px osu!font';
		ctx.textAlign = 'end';
		ctx.fillText(parseInt(user.ranked_score).formatZeros(), 500, 120);

		ctx.fillStyle = '#cccccc';
		ctx.font = '25px osu!font';
		ctx.textAlign = 'start';
		ctx.fillText('Accuracy', 50, 147);

		ctx.fillStyle = '#cccccc';
		ctx.font = '25px osu!font';
		ctx.textAlign = 'end';
		ctx.fillText(`${parseFloat(user.accuracy).toFixed(2)}% (${formatCommas(parseInt(parseFloat(user.pp_raw).toFixed(2)))}pp)`, 500, 150);

		ctx.fillStyle = '#cccccc';
		ctx.font = '25px osu!font';
		ctx.textAlign = 'start';
		ctx.fillText('Play Count', 50, 180);

		ctx.fillStyle = '#cccccc';
		ctx.font = '25px osu!font';
		ctx.textAlign = 'end';
		ctx.fillText(formatCommas(user.playcount), 500, 180);

		const ARank = new Canvas.Image();
		ctx.globalAlpha = 0.8;
		ARank.src = path.join(__dirname, '..', '..', 'assets', 'osu', 'scores', 'A.png');
		ctx.drawImage(ARank, 260, 190, 50, 80);

		ctx.fillStyle = '#cccccc';
		ctx.font = '25px osu!font';
		ctx.textAlign = 'center';
		ctx.fillText(user.count_rank_a, 325, 235);

		const SRank = new Canvas.Image();
		SRank.src = path.join(__dirname, '..', '..', 'assets', 'osu', 'scores', 'S.png');
		ctx.drawImage(SRank, 340, 190, 50, 80);

		ctx.fillStyle = '#cccccc';
		ctx.font = '25px osu!font';
		ctx.fillText(user.count_rank_s, 405, 235);

		const SSRank = new Canvas.Image();
		SSRank.src = path.join(__dirname, '..', '..', 'assets', 'osu', 'scores', 'SS.png');
		ctx.drawImage(SSRank, 420, 190, 50, 80);

		ctx.fillStyle = '#cccccc';
		ctx.font = '25px osu!font';
		ctx.fillText(user.count_rank_ss, 485, 235);

		// Progress bar (http://www.tothenew.com/blog/tutorial-to-create-a-circular-progress-bar-with-canvas/)
		ctx.textAlign = 'start';
		const al = parseFloat(Math.round(parseFloat(user.level.toString().slice(2)) * 100));
		const start = 4.72;
		const cw = 600;
		const ch = 100;
		const radius = 70;
		const diff = (al / 100) * Math.PI * 2;
		ctx.beginPath();
		ctx.arc(cw, ch, radius, 0, 2 * Math.PI, false);
		ctx.globalAlpha = 0.75;
		ctx.fillStyle = '#FFF';
		ctx.fill();
		ctx.strokeStyle = '#e7f2ba';
		ctx.stroke();
		ctx.fillStyle = '#000';
		ctx.strokeStyle = numToHex(Math.floor(user.level));
		ctx.textAlign = 'center';
		ctx.lineWidth = 15;
		ctx.beginPath();
		ctx.arc(cw, ch, radius, start, diff + start, false);
		ctx.stroke();
		ctx.font = '15px osu!font';
		ctx.fillText(`Lv ${Math.floor(user.level)} (${al}%)`, cw + 2, ch + 6);


		return msg.channel.sendFile(canvas.toBuffer()).catch(null);
	}
};

Number.prototype.roundToNearest = function(multiple, roundingFunction) { // eslint-disable-line
	roundingFunction = roundingFunction || Math.round;
	/*
	// http://stackoverflow.com/questions/17405899/javascript-round-by-100
	var value1 = 8.5;
	var value2 = 0.1;

	console.log(value1.roundToNearest(5));              // Returns 10
	console.log(value1.roundToNearest(5, Math.floor));  // Returns 5
	console.log(value2.roundToNearest(2, Math.ceil));   // Returns 2
	*/
	return roundingFunction(this / multiple) * multiple;
};

Number.prototype.formatZeros = function() { // eslint-disable-line
	// http://stackoverflow.com/questions/36734201/how-to-convert-numbers-to-million-in-javascript
	// Nine Zeroes for Billions
	return Math.abs(Number(this)) >= 1.0e+9

    ? `${Math.trunc(Math.abs(Number(this)) / 1.0e+9)}B`
    // Six Zeroes for Millions
    : Math.abs(Number(this) >= 1.0e+6)

    ? `${Math.trunc(Math.abs(Number(this)) / 1.0e+6)}M`
    // Three Zeroes for Thousands
    : Math.abs(Number(this)) >= 1.0e+3

    ? `${Math.trunc(Math.abs(Number(this)) / 1.0e+3)}K`

    : Math.trunc(Math.abs(Number(this)));
};

function numToHex(num) {
	if (num > 0 && num <= 15) return `#6BD867`;
	else if (num <= 30) return `#6C9EC5`;
	else if (num <= 45) return `#318CE7`;
	else if (num <= 60) return `#8380A9`;
	else if (num <= 75) return `#C586C0`;
	else if (num <= 90) return `#FCCC59`;
	else if (num > 90) return `#FA4C4B`;
	return `#CC0000`;
}

function wrapText(context, text, x, y, maxWidth, lineHeight) { // eslint-disable-line
	// http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
	var words = text.split(' ');
	var line = '';

	for (let i = 0; i < words.length; n++) {
		var testLine = `${line + words[i]} `;
		var metrics = context.measureText(testLine);
		var testWidth = metrics.width;
		if (testWidth > maxWidth && i > 0) {
			context.fillText(line, x, y);
			line = `${words[i]} `;
			y += lineHeight;
		}		else {
			line = testLine;
		}
	}
	context.fillText(line, x, y);
}

function truncateText(ctx, text, limit) {
	while (ctx.measureText(text).width > limit) text = text.substring(0, text.length - 1); return text;
}

function formatCommas(str) { // eslint-disable-line
	// http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
	return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
