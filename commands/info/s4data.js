const { Command } = require('discord.js-commando');
const request = require('superagent');

const charAliases = {
	bayonetta: ['bayo'],
	bowser: ['boozer'],
	'bowser jr': ['bjr'],
	'captain falcon': ['capt. falcon', 'cf', 'falcon'],
	cloud: ['randall'],
	charizard: ['zard'],
	corrin: [],
	'dark pit': ['dp'],
	'diddy kong': ['diddy'],
	'donkey kong': ['dk', 'donkey'],
	'dr mario': ['drm', 'drmario'],
	'duck hunt': ['dh', 'duck hunt dog'],
	fox: ['toryaaa'],
	falco: ['blipblip'],
	'mr game watch': ['gnw', 'g&w', 'gdubs', 'game and watch', 'game watch'],
	ganondorf: ['ganon', 'gannondorf', 'gannon', 'king of hyrule'],
	greninja: ['658', 'froggo', 'gren'],
	ike: [],
	jigglypuff: ['jiggs', 'jigs', 'marshmallow', '39'],
	'king dedede': ['d3', 'dedede', 'king d3'],
	kirby: ['pink puffball'],
	'toon link': ['tink'],
	link: ['l@nk', 'lank'],
	'Little Mac': ['lm'],
	lucario: ['luc', '448'],
	lucina: [],
	lucas: [],
	luigi: ['loogie', 'the brother'],
	mario: [],
	marth: [],
	'mega man': ['mm', 'blue bomber'],
	'meta knight': ['mk', 'the galactic warrior'],
	'mii gunner': ['miig', 'gunner'],
	'mii swordfighter': ['miis', 'swordfighter'],
	'mii brawler': ['miib', 'brawler'],
	mewtwo: ['#150', 'world\'s most powerful pokemon', '150'],
	ness: [],
	olimar: [],
	'pac man': ['pm', 'pac-man', 'pacman'],
	peach: ['princess peach', 'princess toadstool', 'toadstool'],
	pikachu: ['small mouse pokemon', '25'],
	pit: [],
	robin: [],
	rob: ['robotic operating buddy', 'r.o.b'],
	roy: [],
	'rosalina luma': ['rosa', 'rosalina', 'luma'],
	ryu: [],
	samus: ['intergalactic bounty hunter'],
	sheik: [],
	shulk: [],
	sonic: ['2fast', 'you\re too slow'],
	villager: ['killager'],
	wario: [],
	'wii fit trainer': ['wft'],
	wolf: [],
	yoshi: [],
	zelda: [],
	'zero suit samus': ['zss']
};
const moves = ['jab', 'dash attack', 'fair', 'nair', 'bair', 'uair', 'dair', 'fsmash', 'dsmash', 'usmash', 'fthrow', 'dthrow', 'uthrow', 'bthrow', 'ftilt', 'utilt', 'dtilt'];

module.exports = class KHCommand extends Command {
	constructor(client) {
		super(client, {
			name: 's4data',
			group: 'info',
			memberName: 's4data',
			description: 'Provides info about characters in Sm4sh',
			examples: ['s4data lucario', 's4data lucario bair'],

			args: [
				{
					key: 'params',
					prompt: 'Please provide a character. Additionally, moveset is optional.\n',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) { // eslint-disable-line consistent-return
		args.params = args.params.toLowerCase();
		const char = getAliasMatch(args.params, charAliases).match;
		const alias = getAliasMatch(args.params, charAliases).alias;
		if (!char || char === -1) return msg.reply('that character does not exist!');
		const getMove = args.params.substring(args.params.indexOf(alias) + alias.length + 1);
		if (getMove.length < 3 && getMove.length !== 0) return msg.reply('that move name is too short!');
		const embed = new this.client.methods.Embed();
		const url = 'http://api.kuroganehammer.com/api/characters/';
		let out = '';
		const charAttributes = await request.get(`${url}name/${char.replace(/ /g, '')}`).catch(console.error);
		if(!charAttributes) msg.reply('unfortunately it seems that the site is experiencing issues at the moment... try again later.')
		embed.setThumbnail(charAttributes.body.thumbnailUrl);
		embed.setFooter(this.client.user.username, this.client.user.displayAvatarURL);
		embed.setDescription('Kurogane Hammer Data');
		// embed.addField('Character', charAttributes.body.name, true);
		embed.setColor(charAttributes.body.colorTheme);

		if (getMove.length === 0) {
			const moreCharAttributes = await request.get(`${url + charAttributes.body.id}/characterattributes`).catch(console.error);
			let fieldName = translateAttribute(moreCharAttributes.body[0].smashAttributeTypeId), fieldValue = '';
			for (let attribute of moreCharAttributes.body) {
				out += `${translateAttribute(attribute.smashAttributeTypeId)}\n\t${attribute.name}: ${attribute.value}\n`;
				if (fieldName !== translateAttribute(attribute.smashAttributeTypeId)) {
					if (fieldValue.length > 1024) {
						embed.addField(fieldName, `${fieldValue.substring(0, 1023)}-`, true);
						embed.addField(`${fieldName}(continued)`, `-${fieldValue.substring(1024)}`, true);
					}	 else {
						embed.addField(fieldName, fieldValue, true);
					}
					fieldName = translateAttribute(attribute.smashAttributeTypeId);
					fieldValue = '';
				}
				fieldValue += `${attribute.name}: ${attribute.value}\n`;
			}
			embed.addField(fieldName, fieldValue, true);
			embed.setDescription('Move Info', out);
			return msg.channel.sendEmbed(embed);
		} else {
			const moveAttributes = await request.get(`${url + charAttributes.body.id}/moves`).catch(console.error);
			let moveCount = 0;
			for (let move in moveAttributes.body) {
				let moveName = moveAttributes.body[move].name, moveData = '';
				if (moveName.toLowerCase().startsWith(getMove)) {
					for (let moveInfo in moveAttributes.body[move]) {
						if (!['name', 'type', 'ownerId', 'id'].includes(moveInfo) && !['', '-'].includes(moveAttributes.body[move][moveInfo])) moveData += `${camelToNorm(moveInfo)}: ${moveAttributes.body[move][moveInfo]}\n`;
						moveCount++;
					}
					embed.addField(moveName, moveData, true);
				}
			}
			if (moveCount === 0) {
				let specials = [];
				for (let move of moveAttributes.body) {
					if (!startsWithAny(move.name.toLowerCase(), moves)) {
						specials.push(move.name);
					}
				}
				if (specials.join('\n').length >= 900) {
					let field1 = [], field2 = [];
					for (let i = 0; i < specials.length; i++) {
						if ((field1.join('\n').length + specials[i].length) < 900) {
							field1.push(specials[i]);
						} else {
							field2.push(specials[i]);
						}
					}

					embed.addField('Whoops!', `It looks like you're trying to view specials or grabs - here are the special move names for ${char}: \n${field1.join('\n')}`, true);
					embed.addField('(Continued...)', field2.join('\n'), true);
				} else {
					embed.addField('Whoops!', `It looks like you're trying to view specials or grabs - here are the special move names for ${char}: \n${specials.join('\n')}`, true);
				}
			}
			msg.channel.sendEmbed(embed);
		}
	}
};
function camelToNorm(str) {
	return str
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, (string) => {
			return string.toUpperCase();
		});
}

function startsWithAny(str, arr) {
	for (let query of arr) {
		if (str.startsWith(query)) return true;
	}
	return false;
}
function getAliasMatch(str, obj) {
	for (let name in obj) {
		if (str.includes(name)) { return { match: name, alias: name }; } else {
			let length = obj[name].length;
			while (length--) {
				if (str.includes(obj[name][length])) {
					return { match: name, alias: obj[name][length] };
				}
			}
		}
	}
	return -1;
}

function translateAttribute(id) {
	const attributeIds = [{ id: 1, name: 'Air Acceleration' }, { id: 2, name: 'Air Deceleration' }, { id: 3, name: 'Airdodge' }, { id: 4, name: 'Air Friction' }, { id: 5, name: 'Airspeed' }, { id: 6, name: 'Counters' }, { id: 7, name: 'Dash Length' }, { id: 8, name: 'Fall Speed' }, { id: 9, name: 'Getup Options' }, { id: 10, name: 'Gravity' }, { id: 11, name: 'Item toss up' }, { id: 12, name: 'Jab Lock' }, { id: 13, name: 'Jumps' }, { id: 14, name: 'Jumpsquat' }, { id: 15, name: 'Ledge Roll' }, { id: 16, name: 'Reflectors' }, { id: 17, name: 'Rolls' }, { id: 18, name: 'Run Speed' }, { id: 19, name: 'Shields' }, { id: 20, name: 'Smash Charge Release' }, { id: 21, name: 'Spotdodge' }, { id: 22, name: 'Tech' }, { id: 23, name: 'Traction' }, { id: 24, name: 'Trip' }, { id: 25, name: 'Walk Speed' }, { id: 26, name: 'Walk Speed' }];

	for (let attribute of attributeIds) {
		if (attribute.id === id) return attribute.name;
	}
	return 'Weight and Height';
}
