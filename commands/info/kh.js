const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const request = require('superagent');

const chars = [
	'bayonetta',
	'bowser',
	'bowser jr',
	'falco',
	'captain falcon',
	'cloud',
	'charizard',
	'dark pit',
	'diddy kong',
	'donkey kong',
	'dr mario',
	'duck hunt',
	'fox',
	'mr game watch',
	'ganondorf',
	'greninja',
	'ike',
	'jigglypuff',
	'king dedede',
	'kirby',
	'link',
	'little mac',
	'lucario',
	'lucina',
	'lucas',
	'luigi',
	'mario',
	'marth',
	'mega man',
	'meta knight',
	'mii brawler',
	'mii gunner',
	'mii swordfighter',
	'mewtwo',
	'ness',
	'olimar',
	'pac man',
	'palutena',
	'peach',
	'pikachu',
	'pit',
	'rob',
	'robin',
	'roy',
	'rosalina luma',
	'samus',
	'sheik',
	'shulk',
	'sonic',
	'toon link',
	'villager',
	'wario',
	'wii fit trainer',
	'yoshi',
	'zelda',
	'zero suit samus',
	'ryu',
	'corrin'
];

module.exports = class KHCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kh',
			group: 'info',
			memberName: 'kh',
			description: 'Provides info about characters (Sm4sh only so far)',
			details: `Takes information from the kuroganehammer API.`,
			examples: ['kh lucario', 'kh lucario bair'],

			args: [
				{
					key: 'parameters',
					prompt: 'Please provide a character. Additionally, moveset is optional.\n',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) { // eslint-disable-line consistent-return
		const embed = new Discord.RichEmbed();
		const params = args.parameters;
		let url = 'http://api.kuroganehammer.com/api/characters/';
		let out = '';
		let char;
		let getMove;
		char = this.getArrayMatch(params, chars);
		if (char === -1) return msg.reply('the provided character does not exist!');
		getMove = params.substring(params.indexOf(char) + char.length + 1);
		if (getMove.length < 3 && getMove.length !== 0) return msg.say('move name is too short!');
		request.get(`${url}name/${char.replace(/ /g, '')}`)
			.end((error, response) => {
				if (error) return console.error(error);
				embed.setThumbnail(response.body.thumbnailUrl);
				embed.setFooter(this.client.user.username, this.client.user.displayAvatarURL);
				embed.setDescription('Kurogane Hammer Data');
				// embed.addField('Character', res.body.name, true);
				embed.setColor(response.body.colorTheme);
				if (getMove.length === 0) {
					request.get(`${url + response.body.id}/characterattributes`)
						.end((err, res) => {
							if (err) return console.error(err);
							let fieldName = this.translateAttribute(res.body[0].smashAttributeTypeId);
							let fieldValue = '';
							for (let attribute of res.body) {
								out += `${this.translateAttribute(attribute.smashAttributeTypeId)}\n\t${attribute.name}: ${attribute.value}\n`;
								if (fieldName !== this.translateAttribute(attribute.smashAttributeTypeId)) {
									embed.addField(fieldName, fieldValue, true);
									fieldName = this.translateAttribute(attribute.smashAttributeTypeId);
									fieldValue = '';
								}
								fieldValue += `${attribute.name}: ${attribute.value}\n`;
							}
							embed.addField(fieldName, fieldValue, true);
							embed.setDescription('Move Info', out);
							return msg.embed(embed);
						});
				}
				request.get(`${url + response.body.id}/moves`)
					.end((err, res) => {
						if (err) return console.error(err);
						let moveCount = 0;
						for (let move in res.body) {
							let moveName = res.body[move].name;
							let moveData = '';
							if (moveName.toLowerCase().startsWith(getMove)) {
								for (let moveInfo in res.body[move]) {
									if (!['name', 'type', 'ownerId', 'id'].includes(moveInfo) && !['', '-'].includes(res.body[move][moveInfo])) moveData += `${this.camelToNorm(moveInfo)}: ${res.body[move][moveInfo]}\n`;
									moveCount++;
								}
								embed.addField(moveName, moveData, true);
							}
						}
						if (moveCount === 0) {
							let specials = [];
							for (let move of res.body) {
								if (!this.startsWithAny(move.name.toLowerCase(), ['jab', 'dash attack', 'fair', 'nair', 'bair', 'uair', 'dair', 'fsmash', 'dsmash', 'usmash', 'fthrow', 'dthrow', 'uthrow', 'bthrow', 'ftilt', 'utilt', 'dtilt'])) {
									specials.push(move.name);
								}
							}
							if (specials.join('\n').length >= 900) {
								let field1 = [];
								let field2 = [];
								for (let i = 0; i < specials.length; i++) {
									if ((field1.join("\n").length + specials[i].length) < 900) {
										field1.push(specials[i]);
									} else {
										field2.push(specials[i]);
									}
								}

								embed.addField('Whoops!', `It looks like you're trying to view specials or grabs - here are the special move names for ${char}: ${field1.join('\n')}`, true);
								embed.addField('(Continued...)', field2.join('\n'), true);
							} else {
								embed.addField('Whoops!', `It looks like you're trying to view specials or grabs - here are the special move names for ${char}: ${specials.join('\n')}`, true)
							}
						}
						return msg.embed(embed);
					});
			});
	}

	translateAttribute(id) {
		let attributeIds = [
			{ id: 1, name: 'Air Acceleration' },
			{ id: 2, name: 'Air Deceleration' },
			{ id: 3, name: 'Airdodge' },
			{ id: 4, name: 'Air Friction' },
			{ id: 5, name: 'Airspeed' },
			{ id: 6, name: 'Counters' },
			{ id: 7, name: 'Dash Length' },
			{ id: 8, name: 'Fall Speed' },
			{ id: 9, name: 'Getup Options' },
			{ id: 10, name: 'Gravity' },
			{ id: 11, name: 'Item toss up' },
			{ id: 12, name: 'Jab Lock' },
			{ id: 13, name: 'Jumps' },
			{ id: 14, name: 'Jumpsquat' },
			{ id: 15, name: 'Ledge Roll' },
			{ id: 16, name: 'Reflectors' },
			{ id: 17, name: 'Rolls' },
			{ id: 18, name: 'Run Speed' },
			{ id: 19, name: 'Shields' },
			{ id: 20, name: 'Smash Charge Release' },
			{ id: 21, name: 'Spotdodge' },
			{ id: 22, name: 'Tech' },
			{ id: 23, name: 'Traction' },
			{ id: 24, name: 'Trip' },
			{ id: 25, name: 'Walk Speed' },
			{ id: 26, name: 'Weight' }
		];

		for (let attribute of attributeIds) {
			if (attribute.id === id) return attribute.name;
		}
		return 'Not Found';
	}

	getArrayMatch(str, arr) {
		let length = arr.length;
		while (length--) {
			if (str.includes(arr[length])) {
				// one of the substrings is in yourstring
				let match = str.substring(str.indexOf(arr[length]), str.indexOf(arr[length]) + arr[length].length);
				return match;
			}
		}
		return -1;
	}

	toTitleCase(str) {
		if ((str === null) || (str === '')) return false;
		str = str.toString();

		return str.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
	}

	camelToNorm(str) {
		return str
		// insert a space before all caps
		.replace(/([A-Z])/g, ' $1')
		// uppercase the first character
		.replace(/^./, (string) => {
			return string.toUpperCase();
		});
	}

	startsWithAny(str, arr) {
		for (let query of arr) {
			if (str.startsWith(query)) return true;
		}
		return false;
	}
};

String.prototype.capitalize = () => { return this.charAt(0).toUpperCase() + this.slice(1); };
