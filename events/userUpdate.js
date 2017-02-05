exports.run = (bot, olduser, newuser) => {
  // avatars
	bot.guilds.forEach(guild => {
		let logs = bot.provider.get(guild, 'logs');
		if (newuser.bot) return;
		if (!guild.member(olduser.id)) return;
		if (logs && logs.enabled && logs.channel) {
			let embed = new bot.methods.Embed();
			embed.setTimestamp(new Date()).setAuthor(`${newuser.username} (${newuser.id})`, newuser.avatarURL).setFooter(bot.user.username, bot.user.avatarURL);
			if (logs.fields.avatars !== false && olduser.avatarURL !== newuser.avatarURL) {
				embed.setColor('#0055ff');
				if (olduser.avatarURL) embed.setThumbnail(olduser.avatarURL);
				if (newuser.avatarURL) embed.setImage(newuser.avatarURL);
				embed.addField('\uD83D\uDDBC AVATAR CHANGE', `${newuser.username} has changed avatars`);
				guild.channels.get(logs.channel).sendEmbed(embed).catch(() => null);
			}
			if (logs.fields.usernames !== false && olduser.username !== newuser.username) {
				embed.setColor('#0000bb');
				embed.addField('\uD83D\uDD27 USERNAME CHANGE', `Old: ${olduser.username}\nNew: ${newuser.username}`);
				guild.channels.get(logs.channel).sendEmbed(embed).catch(() => null);
			}
		}
	});
};
