exports.run = (bot, oldMember, newMember) => {
  // nicknames, roles
	const logs = bot.provider.get(newMember.guild, 'logs');
	if (logs && logs.enabled && logs.channel) {
		let embed = new bot.methods.Embed();
		embed.setTimestamp(new Date()).setAuthor(`${oldMember.user.username} (${oldMember.user.id})`, oldMember.user.avatarURL).setFooter(bot.user.username, bot.user.avatarURL);

		if (logs.fields.nickname !== false && oldMember.nickname !== newMember.nickname) {
			embed.setColor('#00bbff');
			if (oldMember.nickname && newMember.nickname) embed.addField(':wrench: NICKNAME CHANGE', `${oldMember.user.username} has changed their nickname from ${oldMember.nickname} to: ${newMember.nickname}`);
			else if (!oldMember.nickname) embed.addField(':wrench: NICKNAME CHANGE', `${oldMember.user.username} has added the nickname: ${newMember.nickname}`);
			else if (!newMember.nickname) embed.addField(':wrench: NICKNAME CHANGE', `${oldMember.user.username} has removed the nickname: ${oldMember.nickname}`);
			newMember.guild.channels.get(logs.channel).sendEmbed(embed).catch(() => null);
		}
		if (logs.fields.roles !== false && oldMember.roles.size !== newMember.roles.size) {
			embed.setColor('#8800bb');
			embed.addField('\uD83D\uDD27 ROLE CHANGE', `${oldMember.user.username}'s roles have changed:\nOld: \`\u200B${oldMember.roles.map(role => role.name).join(', ').substring(11)}\`\nNew: \`\u200B${newMember.roles.map(role => role.name).join(', ').substring(11)}\``);
			newMember.guild.channels.get(logs.channel).sendEmbed(embed).catch(() => null);
		}
	}
};
