exports.run = async (bot, oldmsg, newmsg) => {
	if (!oldmsg.guild || !oldmsg.guild.available) return;
	const logs = bot.provider.get(newmsg.guild, 'logs');
	if (logs && logs.enablede && logs.channel && logs.fields.messages !== false) {
		if (oldmsg !== null && newmsg !== null && oldmsg.content !== newmsg.content) {
			let embed = new bot.methods.Embed(), oldout = '', newout = '';

			if (oldmsg.content.length >= 500) oldout = `${oldmsg.cleanContent.substring(0, 500)}...`;
			else oldout = oldmsg.cleanContent;
			if (newmsg.content.length >= 500) newout = `${newmsg.cleanContent.substring(0, 500)}...`;
			else newout = newmsg.cleanContent;

			embed.setColor('#ffbb00').setTimestamp(new Date()).setAuthor(`${oldmsg.author.username} (${oldmsg.author.id})`, oldmsg.author.avatarURL);
			embed.addField(`\uD83D\uDCDD UPDATED MESSAGE ${oldmsg.channel}`, `**Old**: ${oldout}\n**New**: ${newout}`);
			embed.setFooter(bot.user.username, bot.user.avatarURL);
			if (oldmsg.attachments && oldmsg.attachments.first() && bot.funcs.validateUrl(oldmsg.attachments.first().url)) embed.addField('Old Attachment', oldmsg.attachments.first().url);
			if (newmsg.attachments && newmsg.attachments.first() && oldmsg.attachments.first().url !== newmsg.attachments.first().url && bot.funcs.validateUrl(newmsg.attachments.first().url)) embed.addField('New Attachment', newmsg.attachments.first().url);
			newmsg.guild.channels.get(logs.channel).sendEmbed(embed).catch(() => null);
		}
	}
};
