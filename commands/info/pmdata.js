const { Command } = require('discord.js-commando');
const jsonfile = require('jsonfile');
const path = require('path');
const { stripIndents } = require('common-tags');

const moves = {
	JabDA: ['jab', 'jab1', 'jab2', 'jab3', 'jab4', 'dashattack'],
	Tilt: ['utilt', 'ftilt', 'ftilt2', 'ftilt3', 'ftilt high', 'ftilt low', 'dtilt', 'ctilt'],
	Smash: ['usmash', 'fsmash', 'fsmash2', 'fsmash high', 'fsmash low', 'dsmash'],
	Aerial: ['uair', 'fair', 'dair', 'bair', 'nair'],
	Special: ['neutralb', 'sideb', 'upb', 'downb'],
	Grab: ['grab', 'fthrow', 'bthrow', 'dthrow', 'uthrow']
};
const chars = {
	bowser: {
		alias: ['boozer'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vMi8yNS9NZW5TZWxjaHJDaHJGYWNlLjAxMi5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '008866'
	},
	'captain falcon': {
		alias: ['capt. falcon', 'cf', 'falcon'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vYy9jZC9NZW5TZWxjaHJDaHJGYWNlLjAxMC5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '4444bb'
	},
	charizard: {
		alias: ['zard'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vOC84Yy9NZW5TZWxjaHJDaHJGYWNlLjAyOS5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'aa0000'
	},
	'diddy kong': {
		alias: ['diddy'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vMC8wOC9NZW5TZWxjaHJDaHJGYWNlLjAyNy5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'a06022'
	},
	'donkey kong': {
		alias: ['dk', 'donkey'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vNC80NC9NZW5TZWxjaHJDaHJGYWNlLjAwMi5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '804022'
	},
	fox: {
		alias: ['toryaaa'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vMi8yNS9NZW5TZWxjaHJDaHJGYWNlLjAwNy5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'd0a022'
	},
	falco: {
		alias: ['blipblip'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vMi8yZC9NZW5TZWxjaHJDaHJGYWNlLjAxOS5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '4033cb'
	},
	'game & watch': {
		alias: ['gnw', 'g&w', 'gdubs', 'game and watch', 'game watch'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vZC9kYy9NZW5TZWxjaHJDaHJGYWNlLjAxOC5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '000000'
	},
	ganondorf: {
		alias: ['ganon', 'gannondorf', 'gannon', 'king of hyrule'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vOS85NC9NZW5TZWxjaHJDaHJGYWNlLjAyMC5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '555588'
	},
	'ice climbers': {
		alias: ['ics', 'icies'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vNC80OS9NZW5TZWxjaHJDaHJGYWNlLjAxNi5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'dd66ff'
	},
	ike: {
		alias: [],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vYS9hNy9NZW5TZWxjaHJDaHJGYWNlLjAzNC5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'aaaa33'
	},
	ivysaur: {
		alias: ['ivy', '02', '#2'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vZS9lYi9NZW5TZWxjaHJDaHJGYWNlLjAzMS5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '00bb77'
	},
	jigglypuff: {
		alias: ['jiggs', 'jigs', 'marshmallow', '39'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vMC8wNy9NZW5TZWxjaHJDaHJGYWNlLjAzNy5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'ffaaaa'
	},
	'king dedede': {
		alias: ['d3', 'dedede', 'king d3', 'ripple\'s main <3'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vYS9hOC9NZW5TZWxjaHJDaHJGYWNlLjAzMi5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'ffaaaa'
	},
	kirby: {
		alias: ['pink puffball'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vOS85ZS9NZW5TZWxjaHJDaHJGYWNlLjAwNi5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'ffaaaa'
	},
	'toon link': {
		alias: ['tink'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vYS9hZC9NZW5TZWxjaHJDaHJGYWNlLjA0MS5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '00bb88'
	},
	link: {
		alias: ['l@nk', 'lank'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vNi82OS9NZW5TZWxjaHJDaHJGYWNlLjAwMy5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '00aa66'
	},
	lucario: {
		alias: ['fur bait', 'hotness', 'our lord and savior', 'best character', 'favorite pornstar', '#448', '448'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vMy8zMC9NZW5TZWxjaHJDaHJGYWNlLjAzMy5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '80bfff'
	},
	lucas: {
		alias: [],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vMS8xYS9NZW5TZWxjaHJDaHJGYWNlLjAyNi5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'dddd55'
	},
	luigi: {
		alias: ['loogie', 'the brother'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vNi82YS9NZW5TZWxjaHJDaHJGYWNlLjAwOS5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '009955'
	},
	mario: {
		alias: ['the better'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vOS85Zi9NZW5TZWxjaHJDaHJGYWNlLjAwMS5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'dd0000'
	},
	marth: {
		alias: ['effsmash'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vMS8xNy9NZW5TZWxjaHJDaHJGYWNlLjAxNy5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '5555dd'
	},
	'meta knight': {
		alias: ['mk', 'the galactic warrior'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vNS81ZS9NZW5TZWxjaHJDaHJGYWNlLjAyMi5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '330088'
	},
	mewtwo: {
		alias: ['#150', 'world\'s most powerful pokemon', '150'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vNi82ZC9NZW5TZWxjaHJDaHJGYWNlLjAyOC5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'aa88aa'
	},
	ness: {
		alias: [],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vOC84NS9NZW5TZWxjaHJDaHJGYWNlLjAxMS5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'dd0000'
	},
	olimar: {
		alias: [],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vZS9lZi9NZW5TZWxjaHJDaHJGYWNlLjAyNS5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'ffaa77'
	},
	peach: {
		alias: ['princess peach', 'princess toadstool', 'toadstool'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vOS85MS9NZW5TZWxjaHJDaHJGYWNlLjAxMy5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'ffaaaa'
	},
	pikachu: {
		alias: ['cute af', 'small mouse pokemon', '25'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vNy83NC9NZW5TZWxjaHJDaHJGYWNlLjAwOC5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'ffff00'
	},
	pit: {
		alias: [],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vMC8wNy9NZW5TZWxjaHJDaHJGYWNlLjAyMy5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'ffffdd'
	},
	rob: {
		alias: ['robotic operating buddy', 'r.o.b'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vNS81Yy9NZW5TZWxjaHJDaHJGYWNlLjAzNS5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '888888'
	},
	roy: {
		alias: [],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vMy8zNy9NZW5TZWxjaHJDaHJGYWNlLjA0MC5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'dd2200'
	},
	samus: {
		alias: ['intergalactic bounty hunter'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vOC84NS9NZW5TZWxjaHJDaHJGYWNlLjAwNC5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'ff6600'
	},
	sheik: {
		alias: ['spoiler alert'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vNC80Zi9NZW5TZWxjaHJDaHJGYWNlLjAxNS5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '888888'
	},
	snake: {
		alias: ['metal gear', 'snek'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vYy9jOC9NZW5TZWxjaHJDaHJGYWNlLjA0Ni5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '888888'
	},
	sonic: {
		alias: ['2fast', 'you\re too slow'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vMi8yNy9NZW5TZWxjaHJDaHJGYWNlLjA0Ny5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '3030ff'
	},
	squirtle: {
		alias: ['07'],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vMi8yMS9NZW5TZWxjaHJDaHJGYWNlLjAzMC5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '80bfff'
	},
	wario: {
		alias: [],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vYi9iYi9NZW5TZWxjaHJDaHJGYWNlLjAzOC5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'ffdd00'
	},
	wolf: {
		alias: [],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vNC80NS9NZW5TZWxjaHJDaHJGYWNlLjA0NC5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '888888'
	},
	yoshi: {
		alias: [],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vNS81Zi9NZW5TZWxjaHJDaHJGYWNlLjAwNS5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '008833'
	},
	zelda: {
		alias: [],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vMS8xYS9NZW5TZWxjaHJDaHJGYWNlLjAxNC5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: 'bb40bb'
	},
	'zero suit samus': {
		alias: [],
		thumbnail: 'http://tu9srvbirvvtnirvexn0zxiuawduaw1ncy5jb200.g00.ign.com/g00/2_d3d3Lmlnbi5jb20%3D_/TU9SRVBIRVVTNiRodHRwOi8vb3lzdGVyLmlnbmltZ3MuY29tL21lZGlhd2lraS9hcGlzLmlnbi5jb20vc21hc2gtYnJvcy1wcm9qZWN0LW0vMS8xNy9NZW5TZWxjaHJDaHJGYWNlLjAyNC5wbmc%2FaTEwYy5tYXJrLmltYWdlLnR5cGU%3D_$/$/$/$/$/$/$',
		color: '00b0ff'
	}
};

module.exports = class PMDataCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pmdata',
			group: 'info',
			memberName: 'pmdata',
			description: 'Provides info about characters from Project M',
			examples: ['pmdata lucario', 'pmdata lucario bair'],

			args: [
				{
					key: 'query',
					prompt: 'Please provide a character. Additionally, moveset is optional.\n',
					type: 'string'
				}
			]
		});
	}

	async run(message, args) { // eslint-disable-line consistent-return
		let parameters = args.query.toLowerCase();
		let type, move, char, thumbnail, detail, item, color, info;

		for (let moveType in moves) {
			if (getArrayMatch(parameters, moves[moveType]) !== -1) {
				type = moveType;
				move = getArrayMatch(parameters, moves[moveType]);
			}
		}

		if (type === 'Special') return message.channel.sendMessage('Sorry, specials are unavailable at the moment');
		else if (type === 'Grab') return message.channel.sendMessage('Sorry, Grabs are unavailable at the moment');

		char = getAliasMatch(parameters, chars);
		if (char !== -1) {
			thumbnail = chars[char].thumbnail;
			color = parseInt(`0x${chars[char].color}`, 16);
			char = this.client.funcs.toTitleCase(char);
		}		else {
			return message.channel.sendMessage('Please provide a character');
		}

		detail = getArrayMatch(parameters, ['detailed']);

		let out = new this.client.methods.Embed();
		let file = {};


		if (type) {
			file = jsonfile.readFileSync(path.join(__dirname, '..', '..', 'assets', 'smash', 'pm', char, 'moveOverview.json'));

			let data = {};

			if (move === 'jab' || move === 'jab1') {
				if (file[type].jab) move = 'jab';
				if (file[type].jab1) move = 'jab1';
			}
			if (file[type][move]) data = file[type][move];
			else return message.channel.sendMessage("Looks like the data for this move doesn't exist");


			out.setTitle(`Data For ${char}'s ${move}`);
			out.setThumbnail(thumbnail);
			out.setColor(color);

			for (item in data) {
				if (!['flags', 'filePath'].includes(item) && data[item] !== -1 && data[item].length > 0) {
					out.addField(item, data[item], true);
				}
			}

			if (detail !== -1) {
				file = jsonfile.readFileSync(path.join(__dirname, '..', '..', 'assets', 'smash', 'pm', char, 'moveData.json'));
				data = file[type][move].move;

				for (let frame in data) {
					let id = [], damage = [], directions = [], BaseKB = [], KBGrowth = [], WeightKB = [], shieldDmg = [], shieldStun = [], hitLag = [];

					for (let part in data[frame]) {
						if (part.startsWith('hitbox')) { // eslint-disable-line max-depth
							info = data[frame][part];
							id.push(info.id);
							damage.push(info.damage);
							directions.push(info.direction);
							BaseKB.push(info.baseknockback);
							WeightKB.push(info.weightknockback);
							KBGrowth.push(info.knockbackgrowth);
							shieldDmg.push(round(info.fullshielddamage, 2));
							shieldStun.push(Math.floor(info.shieldstun));
							hitLag.push(Math.floor(info.hitlag));
						}
					}

					if (damage.length !== 0) {
						info = stripIndents`Hitbox ID: ${id.join(', ')}
						Damage: ${damage.join(', ')}
						Direction: ${directions.join(', ')}
						Base Knockback: ${BaseKB.join(', ')}
						Weight Knockback: ${WeightKB.join(', ')}
						Knockback Growth: ${KBGrowth.join(', ')}
						Shield Damage: ${shieldDmg.join(', ')}
						Shield Stun: ${shieldStun.join(', ')}
						Hitlag: ${hitLag.join(', ')}
						`;
						out.addField(frame, info, true);
					}
				}
			}

			file = jsonfile.readFileSync(path.join(__dirname, '..', '..', 'assets', 'smash', 'pm', char, 'moveOverview.json'));
			message.channel.sendEmbed(out).then(() => {
				if (file[type][move].gfycat) message.channel.sendMessage(file[type][move].gfycat);
			});
		}	else if (char !== -1) {
			file = jsonfile.readFileSync(path.join(__dirname, '..', '..', 'assets', 'smash', 'pm', 'Attributes.json'));
			out.setTitle(`Attributes of ${char}`);
			out.setThumbnail(thumbnail);
			out.setColor(color);

			let charData = file[char];
			for (let category in charData) {
				let catData = '';
				for (let attribute in charData[category]) {
					catData += `${this.client.funcs.toTitleCase(attribute)}: ${charData[category][attribute]} \n`;
				}
				out.addField(category, catData, true);
			}

			message.channel.sendEmbed(out);
		} else {
			return message.channel.sendMessage("Looks like this character doesn't exist!");
		}
	}
};

function getArrayMatch(str, arr) {
	let length = arr.length;
	while (length--) {
		if (str.includes(arr[length])) {
			let match = str.substring(str.indexOf(arr[length]), str.indexOf(arr[length]) + arr[length].length);
			return match;
		}
	}
	return -1;
}

function getAliasMatch(str, obj) {
	for (let name in obj) {
		if (str.includes(name)) {
			return name;
		} else if (obj[name] instanceof Array) {
			let length = obj[name].length;
			while (length--) {
				if (str.includes(obj[name][length])) {
					let match = name;
					return match;
				}
			}
		}	else {
			let length = obj[name].alias.length;
			while (length--) {
				if (str.includes(obj[name].alias[length])) {
					let match = name;
					return match;
				}
			}
		}
	}
	return -1;
}

function round(num, places) {
	var multiplier = Math.pow(10, places);
	return Math.round(num * multiplier) / multiplier;
}
String.prototype.capitalize = function() {
	return this.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};
