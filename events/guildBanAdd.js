exports.run = (bot, server, user) => {
	let logs = bot.provider.get(server, 'logs');
	// let bans = bot.provider.get(server, 'bans');
	let mentions = bot.provider.get(server, 'mentions');
	if (logs.enabled && logs.channel && (logs.fields.bans || logs.fields.bans)) {
		let embed = new bot.methods.Embed();
		embed.setColor('#ff0000').setTimestamp(new Date()).setAuthor(`${user.username} (${user.id})`, user.avatarURL).setFooter(bot.user.username, bot.user.avatarURL);
		/*
		if (bans && bans.includes(user.id)) {
			embed.addField('\uD83D\uDEAB AUTOMATIC BAN', `${user.username} has been banned from the server!`);
			bans.splice(bans.indexOf(user.id, 1));
			bot.provider.set(server, 'bans', bans);
		}
		*/
		if (mentions && mentions.enabled) embed.addField('\uD83D\uDEAB FILTER BAN', `${user.username} has been banned from the server for surpassing the mention limit!`);
		else embed.addField('\uD83D\uDEAB NEW BAN', `${user.username} has been banned from the server!`);
		server.channels.get(logs.channel).sendEmbed(embed).catch(() => null);
	}
};
