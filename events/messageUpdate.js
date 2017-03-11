const guildSettings = require('../dataProviders/postgreSQL/models/GuildSettings');
const Redis = require('../dataProviders/redis/Redis');
const redis = new Redis();

exports.run = async (bot, oldmsg, newmsg) => {
	if (!oldmsg.guild || !oldmsg.guild.available) return;
	const settings = await guildSettings.findOne({ where: { guildID: newmsg.guild.id } });
	if (!settings) return;
	const logs = settings.logs;

	const words = await redis.db.getAsync(`filter${newmsg.guild.id}`).then(JSON.parse);
	const enabled = await redis.db.getAsync(`filterenabled${newmsg.guild.id}`).then(JSON.parse);
	if (enabled && words) {
		const member = await newmsg.guild.fetchMember(newmsg.author);
		if (!bot.funcs.isStaff(member) && bot.funcs.hasFilteredWord(words, bot.funcs.filterWord(newmsg.content))) {
			await newmsg.author.send(`Your updated message \`${newmsg.content}\` was deleted due to breaking the filter!`);
			await newmsg.delete();
		}
	}

	if (logs && logs.enabled && logs.channel && logs.fields ? logs.fields.messages !== false : !logs.fields && newmsg.guild.channels.has(logs.channel)) {
		if (oldmsg !== null && newmsg !== null && oldmsg.content !== newmsg.content) {
			let embed = new bot.methods.Embed(), oldout = '', newout = '';

			if (oldmsg.content.length >= 500) oldout = `${oldmsg.cleanContent.substring(0, 500)}...`;
			else oldout = oldmsg.cleanContent;
			if (newmsg.content.length >= 500) newout = `${newmsg.cleanContent.substring(0, 500)}...`;
			else newout = newmsg.cleanContent;

			embed.setColor('#ffbb00').setTimestamp(new Date()).setAuthor(`${oldmsg.author.username} (${oldmsg.author.id})`, oldmsg.author.avatarURL);
			embed.addField(`\uD83D\uDCDD UPDATED MESSAGE ${oldmsg.channel}`, `**Old**: ${oldout}\n**New**: ${newout}`);
			embed.setFooter(bot.user.username, bot.user.avatarURL);
			if (bot.funcs.hasImage(oldmsg)) embed.addField('Old Attachment', bot.funcs.validateImageURL(oldmsg));
			if (bot.funcs.hasImage(newmsg) && (oldmsg.attachments.first().url !== newmsg.attachments.first().url)) embed.addField('New Attachment', bot.funcs.validateImageURL(newmsg));
			newmsg.guild.channels.get(logs.channel).sendEmbed(embed).catch(() => null);
		}
	}
};
