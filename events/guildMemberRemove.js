exports.run = (bot, member) => {
  // leaves/kicks
	const logs = bot.provider.get(member.guild, 'logs');
	const mentions = bot.provider.get(member.guild, 'mentions');
	let rolestate = bot.provider.get(member.guild, 'rolestate', {});

	if (logs && logs.enable && logs.channel && logs.fields.leaves !== false) {
		let embed = new bot.methods.Embed();
		embed.setColor('#ff5050').setTimestamp().setAuthor(`${member.user.username} (${member.user.id})`, member.user.avatarURL).setFooter(bot.user.username, bot.user.avatarURL);

		if (mentions && mentions.enabled && mentions.action === 'kick') embed.addField('\u274C MENTION ABUSE KICK', `${member.user.username} has been removed from the server!`);
		else embed.addField('\u274C NEW LEAVE', `${member.user.username} has left or been kicked from the server!`);
		member.guild.channels.get(logs.channel).sendEmbed(embed).catch(() => null);
	}

	// rolestate
	if (rolestate && rolestate.enabled) {
		member.guild.fetchBans().then(users => {
			if (users.has(member.id)) {
				// if (!rolestate.users) rolestate.users = {};
				rolestate.users[member.id] = member.roles.map(role => role.id);
				bot.provider.set(member.guild, 'rolestate', rolestate);
			}
		}).catch(err => { member.guild.owner.sendMessage(`\uD83D\uDEAB I do not have access to the banned members of server: \`${member.guild.name}\`. Please give me the \`ban members\` or \`administrator\` permission for rolestate to work!${err}`); });
	}
};
