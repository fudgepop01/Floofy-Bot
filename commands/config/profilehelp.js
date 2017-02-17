const { Command } = require('discord.js-commando');
const games = ['64', 'Melee', 'Brawl', 'PM', 'Sm4sh', 'Splatoon'];
const chars = ['Bayonetta', 'Bowser', 'Bowser Jr.', 'Captain Falcon', 'Charizard', 'Cloud', 'Corrin', 'Dark Pit', 'Diddy Kong', 'Donkey Kong', 'Dr. Mario', 'Duck Hunt', 'Falco', 'Fox', 'Ganondorf', 'Greninja', 'Ice Climbers', 'Ike', 'Ivysaur', 'Jigglypuff', 'King Dedede', 'Kirby', 'Link', 'Little Mac', 'Lucario', 'Lucas', 'Lucina', 'Luigi', 'Mario', 'Marth', 'Mega Man', 'Meta Knight', 'Mewtwo', 'Mii Brawler', 'Mii Gunner', 'Mii Swordfighter', 'Mr. Game & Watch', 'Ness', 'Olimar', 'Pac-Man', 'Palutena', 'Peach', 'Pichu', 'Pikachu', 'Pit', 'Pokemon Trainer', 'R.O.B', 'Robin', 'Rosalina & Luma', 'Roy', 'Ryu', 'Samus', 'Sheik', 'Shulk', 'Snake', 'Sonic', 'Squirtle', 'Toon Link', 'Villager', 'Wario', 'Wii Fit Trainer', 'Wolf', 'Yoshi', 'Young Link', 'Zelda', 'Zero Suit Samus', 'Random'];
const fields = ['tag', 'games', 'mains', 'secondaries', 'pockets', 'nnid', 'fc', 'note', 'colour', 'imageurl'];

module.exports = class WelcomeHelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'profilehelp',
			group: 'config',
			memberName: 'profilehelp',
			description: 'Details on how to set up a custom smash profile.'
		});
	}

	async run(msg) {
		return msg.author.sendEmbed({
			color: parseInt('cc0000', 16),
			title: 'How to set up a custom smash profile!',
			fields: [
				{
					name: '**Step 1**: Tag',
					value: 'Use this to set up your tag for your profile!\nExample: `.sp nnid Lewdcario`.'
				},
				{
					name: '**Step 2**: Game',
					value: 'Use this to show what games you play!\nExample: `.sp games Sm4sh, Melee`'
				},
				{
					name: '**Step 3**: Mains',
					value: 'Use this to show who you main!\nExample: `.sp mains Lucario (Sm4sh), Peach (Melee)`'
				},
				{
					name: '**Step 4**: Secondaries',
					value: 'Use this to show who you have as secondaries!\nExample: `.sp secondaries Rosalina & Luma (Sm4sh), Marth (PM)`'
				},
				{
					name: '**Step 5**: Pockets',
					value: 'Use this to show who you have as pockets!\nExample: `.sp pockets Dr. Mario (Sm4sh), Luigi (Melee), Palutena (Sm4sh)`'
				},
				{
					name: '**Step 6**: NNID',
					value: 'Use this to set up your NNID for your profile!\nExample: `.sp nnid sr_lewd`.'
				},
				{
					name: '**Step 7**: Friend Code',
					value: 'Use this to set up your friend code for your profile!\nExample: `.sp fc 1234-5678-9101`.'
				},
				{
					name: '**Step 8**: Note',
					value: 'Use this to set up a custom description for your profile!'
				},
				{
					name: '**Step 9**: Colour',
					value: 'Use this to set a custom highlight colour for your profile! Please note that the input requires hex. Example: `#80BFFF`'
				},
				{
					name: '**Step 10**: ImageURL',
					value: 'Use this to set a custom image/gif to show up at the top of your profile!'
				},
				{
					name: 'Available fields',
					value: fields.join(', ')
				},
				{
					name: 'Games List',
					value: games.join(', ')
				},
				{
					name: 'Characters List',
					value: chars.join(', ')
				},
				{
					name: 'Regions List',
					value: `Coming Soon!`
				}
			]
		});
	}
};
