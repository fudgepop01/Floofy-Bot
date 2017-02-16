const { Command } = require('discord.js-commando');

const UserProfile = require('../../postgreSQL/models/UserProfile');
const games = ['64', 'Melee', 'Brawl', 'PM', 'Sm4sh', 'Splatoon'];
const chars = ['Bayonetta', 'Bowser', 'Bowser Jr.', 'Captain Falcon', 'Charizard', 'Cloud', 'Corrin', 'Dark Pit', 'Diddy Kong', 'Donkey Kong', 'Dr. Mario', 'Duck Hunt', 'Falco', 'Fox', 'Ganondorf', 'Greninja', 'Ice Climbers', 'Ike', 'Ivysaur', 'Jigglypuff', 'King Dedede', 'Kirby', 'Link', 'Little Mac', 'Lucario', 'Lucas', 'Lucina', 'Luigi', 'Mario', 'Marth', 'Mega Man', 'Meta Knight', 'Mewtwo', 'Mii Brawler', 'Mii Gunner', 'Mii Swordfighter', 'Mr. Game & Watch', 'Ness', 'Olimar', 'Pac-Man', 'Palutena', 'Peach', 'Pichu', 'Pikachu', 'Pit', 'Pokemon Trainer', 'R.O.B', 'Robin', 'Rosalina & Luma', 'Roy', 'Ryu', 'Samus', 'Sheik', 'Shulk', 'Snake', 'Sonic', 'Squirtle', 'Toon Link', 'Villager', 'Wario', 'Wii Fit Trainer', 'Wolf', 'Yoshi', 'Young Link', 'Zelda', 'Zero Suit Samus', 'Random'];
const fields = ['tag', 'games', 'mains', 'secondaries', 'pockets', 'nnid', 'fc', 'note', 'colour', 'imageurl'];
const delOptions = ['del', 'delete', 'remove', 'clear'];

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sp',
			group: 'config',
			memberName: 'sp',
			description: 'Updates your profile',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},
			args: [
				{
					key: 'field',
					prompt: `Which field would you like to edit? The options are: ${fields.join(', ')}.\n`,
					type: 'string',
					validate: (str) => {
						if (fields.includes(str)) return true;
						return false;
					}
				},
				{
					key: 'query',
					prompt: 'What would you like to set this field to? If you wish to delete this field, enter `delete`.\n',
					type: 'string',
					validate: (str) => {
						if (delOptions.includes(str.toLowerCase())) return true;
						if (str.length > 150) return 'Your input exceeded the limit.';
						return true;
					},
					parse: (str) => {
						return str.replace(/(@)/g, '@\u200b');
					}
				}
			]
		});
	}

	async run(message, args) {
		let clower = chars.map(char => char.toLowerCase());
		let cgames = games.map(game => game.toLowerCase());
		let profile;
		profile = await UserProfile.findOne({ where: { userID: message.author.id } });
		if (!profile) profile = await UserProfile.create({ userID: message.author.id });
		let smashProfile = profile.smashProfile;

		if (delOptions.includes(args.query)) {
			if (!profile.smashProfile[args.field]) return message.channel.sendMessage('This field does not exist in your profile. Please set it first!');
			delete smashProfile[args.field];
			profile.smashProfile = smashProfile;
			await profile.save();
			return message.channel.sendMessage(`I have deleted \`${args.field}\` from your profile successfully!`);
		}
		smashProfile.lastEdit = new Date();
		if (args.field === 'tag') {
			smashProfile.tag = args.query;
		}	else if (args.field === 'games') {
			let list = args.query.split(', ');
			let mainString = '';
			for (let i = 0; i < list.length; i++) {
				if (cgames.includes(list[i].toLowerCase())) mainString += `${games[cgames.indexOf(list[i].toLowerCase())]}, `;
			}
			if (mainString.length === 0) return message.channel.sendMessage('There were no valid games detected in your input.\nExample: .sp games Sm4sh\nFor a list of games, type `profilehelp`');
			else smashProfile.games = mainString.substring(0, mainString.length - 2);
		}	else if (args.field === 'mains') {
			let list = args.query.split(', ');
			let mainString = '';
			let regex = /\((\w*)\)/;
			for (let i = 0; i < list.length; i++) {
				if (regex.exec(list[i]) && clower.includes(list[i].substring(0, list[i].indexOf(' (')).toLowerCase()) && !mainString.includes(list[i])) {
					mainString += `${chars[clower.indexOf(list[i].substring(0, list[i].indexOf(' (')).toLowerCase())]} `;
					if (cgames.includes(regex.exec(list[i])[1].toLowerCase())) mainString += `(${games[cgames.indexOf(regex.exec(list[i])[1].toLowerCase())]})`;
					mainString += ', ';
				} else if (clower.includes(list[i].toLowerCase()) && !mainString.includes(chars[clower.indexOf(list[i].toLowerCase())])) { mainString += `${chars[clower.indexOf(list[i].toLowerCase())]}, `; }
			}
			if (mainString.length === 0) return message.channel.sendMessage('There were no valid characters detected in your input.\nExample: `.sp mains Lucario (Sm4sh), Rosalina & Luma, Mr. Game & Watch (Melee)`\nFor a list of characters, type `profilehelp`.');
			else smashProfile.mains = mainString.substring(0, mainString.length - 2);
		} else if (args.field === 'secondaries') {
			let list = args.query.split(', ');
			let mainString = '';
			let regex = /\((\w*)\)/;
			for (let i = 0; i < list.length; i++) {
				if (regex.exec(list[i]) && clower.includes(list[i].substring(0, list[i].indexOf(' (')).toLowerCase()) && !mainString.includes(list[i])) {
					mainString += `${chars[clower.indexOf(list[i].substring(0, list[i].indexOf(' (')).toLowerCase())]} `;
					if (cgames.includes(regex.exec(list[i])[1].toLowerCase())) mainString += `(${games[cgames.indexOf(regex.exec(list[i])[1].toLowerCase())]})`;
					mainString += ', ';
				} else if (clower.includes(list[i].toLowerCase()) && !mainString.includes(chars[clower.indexOf(list[i].toLowerCase())])) { mainString += `${chars[clower.indexOf(list[i].toLowerCase())]}, `; }
			}
			if (mainString.length === 0) return message.channel.sendMessage('There were no valid characters detected in your input.\nExample: `.sp secondaries Lucario (Sm4sh), Rosalina & Luma, Mr. Game & Watch (Melee)`\nFor a list of characters, type `profilehelp`.');
			else smashProfile.secondaries = mainString.substring(0, mainString.length - 2);
		} else if (args.field === 'pockets') {
			let list = args.query.split(', ');
			let mainString = '';
			let regex = /\((\w*)\)/;
			for (let i = 0; i < list.length; i++) {
				if (regex.exec(list[i]) && clower.includes(list[i].substring(0, list[i].indexOf(' (')).toLowerCase()) && !mainString.includes(list[i])) {
					mainString += `${chars[clower.indexOf(list[i].substring(0, list[i].indexOf(' (')).toLowerCase())]} `;
					if (cgames.includes(regex.exec(list[i])[1].toLowerCase())) mainString += `(${games[cgames.indexOf(regex.exec(list[i])[1].toLowerCase())]})`;
					mainString += ', ';
				} else if (clower.includes(list[i].toLowerCase()) && !mainString.includes(chars[clower.indexOf(list[i].toLowerCase())])) { mainString += `${chars[clower.indexOf(list[i].toLowerCase())]}, `; }
			}
			if (mainString.length === 0) return message.channel.sendMessage('There were no valid characters detected in your input.\nExample: `.sp pockets Lucario (Sm4sh), Rosalina & Luma, Mr. Game & Watch (Melee)`\nFor a list of characters, type `profilehelp`.');
			else smashProfile.pockets = mainString.substring(0, mainString.length - 2);
		} else if (args.field === 'nnid') {
			if (args.query.length < 6 || args.query.length > 16) return message.channel.sendMessage('The Nintendo Network ID should be between 6 and 16 characters long.');
			smashProfile.nnid = args.query;
		} else if (args.field === 'fc') {
			if (args.query.length !== 14) return message.channel.sendMessage('Format is: `1234-5678-9101`');
			smashProfile.fc = args.query;
		} else if (args.field === 'note') {
			smashProfile.note = args.query;
		} else if (args.field === 'colour' || args.field === 'color') {
			if (!/^#?[\da-f]{6}$/.test(args.query)) {
				return message.channel.sendMessage('Example of valid hex code: `#32345f`');
			} else {
				args.query = args.query.replace('#', '');
				smashProfile.colour = parseInt(args.query, 16);
				message.channel.sendMessage(`Your colour: https://dummyimage.com/50x50/${args.query}`);
			}
		} else if (args.field === 'imageurl') {
      // kLINK_DETECTION_REGEX = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi
			smashProfile.imageURL = args.query.replace(/<|>/g, '');
		}
		profile.smashProfile = smashProfile;
		return profile.save().then(async () => {
			message.reply('your profile has been updated successfully!');
		}).catch(console.error);
	}
};
