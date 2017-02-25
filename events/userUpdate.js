const guildSettings = require('../dataProviders/postgreSQL/models/GuildSettings')

exports.run = async (bot, olduser, newuser) => {
  // avatars
	for (let guild of bot.guilds) {
		let settings = await guildSettings.findOne({ where: { guildID: guild.id } });
		if (!settings || newuser.bot || !guild.member(olduser.id)) continue;
		let logs = settings.logs;
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
	}
};
