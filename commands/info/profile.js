const { Command } = require('discord.js-commando');
const UserProfile = require('../../dataProviders/postgreSQL/models/UserProfile');
const { owner } = require('../../settings');

const fields = {
	tag: 'Tag',
	games: 'Games',
	fc: 'Friend code',
	nnid: 'NNID',
	mains: 'Mains',
	secondaries: 'Secondaries',
	pockets: 'Pockets',
	note: 'Note'
};

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'profile',
			group: 'info',
			memberName: 'profile',
			description: 'Get info on a user.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'user',
					prompt: 'what user would you like to have information on?\n',
					type: 'user'
				}
			]
		});
	}

	async run(message, args) {
		let bot = message.client;
		let embed = new bot.methods.Embed();
		const profile = await UserProfile.findOne({ where: { userID: args.user.id } });

		if (args.user === bot.users.get(owner)) {
			embed.setURL('https://twitter.com/Lewdicario');
			embed.setAuthor(`${bot.users.get(owner).username}#${bot.users.get(owner).discriminator}`, bot.users.get(owner).avatarURL);
			embed.setThumbnail('http://i.imgur.com/Q9jaVGc.gif');
			embed.addField("Hello, I'm the creator of Floofy Bot!", "[Ask bot questions here!](https://discord.gg/0yUWR2OBEc62vtFU)\n[Invite Floofy with this link!](https://discordapp.com/oauth2/authorize?client_id=177222966935814153&scope=bot&permissions=66186303)\n[I do commissions, check it out if you'd like!](https://twitter.com/Lewdicario/status/748752095923150848)");
		}	else if (args.user === bot.users.get('69910888961806336')) {
			let user = bot.users.get('69910888961806336');
			embed.setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL);
			embed.addField("Hello, I'm the co-creator of Floofy Bot!", "[Ask bot questions here!](https://discord.gg/0yUWR2OBEc62vtFU)\n[Invite Floofy with this link!](https://discordapp.com/oauth2/authorize?client_id=177222966935814153&scope=bot&permissions=66186303)\n[My friend does commissions, check it out if you'd like!](https://twitter.com/Lewdicario/status/748752095923150848)");
		} else {
			embed.setAuthor(`${args.user.username}'s Profile`, args.user.avatarURL);
		}
		// thanks programmix <3
		Object.keys(profile.smashProfile).forEach(key => {
			if (profile.smashProfile[key] && fields[key]) embed.addField(fields[key], profile.smashProfile[key], true);
		});
		if (profile.smashProfile.colour) embed.setColor(profile.smashProfile.colour);
		else embed.setColor(8323072);
		if (profile.smashProfile.lastEdit) embed.setTimestamp(profile.smashProfile.lastEdit);
		else embed.setTimestamp();
		if (profile.smashProfile.imageURL) embed.setThumbnail(profile.smashProfile.imageURL);
		embed.setFooter('Last Edited', bot.user.avatarURL);


		return message.channel.sendEmbed(embed).catch(err => {
			console.error(JSON.stringify(profile.smashProfile) + err);
			message.channel.sendMessage('There was an issue loading this profile. Most likely due to an invalid URL set for `imageURL` or colour (must be a **hex**)! Please insert valid fields and try again.');
		});
	}
};
