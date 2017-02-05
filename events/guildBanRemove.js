exports.run = (bot, server, user) => {
  // unbans
	let logs = bot.provider.get(server, 'logs');
	if (logs && logs.enabled && logs.channel && logs.fields.bans === false) {
		let embed = new bot.methods.Embed();
		embed.setColor('#66ff99');
    // might change colour to lime green
		embed.setTimestamp(new Date());
		embed.setAuthor(`${user.username} (${user.id})`, user.avatarURL);
		embed.addField('\u2705 UNBAN', `${user.username} has been unbanned from the server.`);
		embed.setFooter(bot.user.username, bot.user.avatarURL);
		server.channels.get(logs.channel).sendEmbed(embed).catch(() => null);
	}
};
