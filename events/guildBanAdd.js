const guildSettings = require('../dataProviders/postgreSQL/models/GuildSettings');

exports.run = async (bot, server, user) => {
	const settings = await guildSettings.findOne({ where: { guildID: server.id } });
	if (!settings) return;
	const logs = settings.logs;
	// const mentions = bot.provider.get(server, 'mentions');
	if (logs.enabled && logs.channel && logs.fields ? logs.fields.bans !== false : !logs.fields && server.channels.has(logs.channel)) {
		let embed = new bot.methods.Embed();
		embed.setColor('#ff0000').setTimestamp(new Date()).setAuthor(`${user.username} (${user.id})`, user.avatarURL).setFooter(bot.user.username, bot.user.avatarURL);
		/* if (mentions && mentions.enabled) embed.addField('\uD83D\uDEAB FILTER BAN', `${user.username} has been banned from the server for surpassing the mention limit!`);
		else*/ embed.addField('\uD83D\uDEAB NEW BAN', `${user.username} has been banned from the server!`);
		server.channels.get(logs.channel).sendEmbed(embed).catch(() => null);
	}
};
