const guildSettings = require('../dataProviders/postgreSQL/models/GuildSettings')
const Redis = require('../dataProviders/redis/Redis');
const redis = new Redis();

exports.run = async (bot, message) => {
	if (!message || !message.guild) return;
	const settings = await guildSettings.findOne({ where: { guildID: message.guild.id } });
	if (!settings) return;
	const words = await redis.db.getAsync(`filter${message.guild.id}`).then(JSON.parse);
	const enabled = await redis.db.getAsync(`filterenabled${message.guild.id}`).then(JSON.parse);
	const logs = settings.logs;

	if (logs && logs.enabled === true && logs.channel && logs.fields.messages !== false) {
		let embed = new bot.methods.Embed(), out = '';

		if (message.content.length >= 1020) out = `${message.cleanContent.substring(0, 1020)}...`;
		else out = message.cleanContent;

		embed.setColor('#ffbb00').setTimestamp(new Date()).setAuthor(`${message.author.username} (${message.author.id})`, message.author.avatarURL).setFooter(bot.user.username, bot.user.avatarURL);

		if (!(enabled && filter.words && bot.funcs.hasFilteredWord(words, message.content))) embed.addField(`\u2757\uFE0F DELETED MESSAGE ${message.channel}`, out);
		else embed.addField(`\u2757\uFE0F FILTERED MESSAGE ${message.channel}`, out);
    // maybe change colour to orange
		if (message.attachments && message.attachments.first() && bot.funcs.validateUrl(message.attachments.first().url)) embed.addField('Attachment', message.attachments.first().url);
		message.guild.channels.get(logs.channel).sendEmbed(embed).catch(() => null);
	}
};
