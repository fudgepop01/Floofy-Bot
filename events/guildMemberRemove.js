const guildSettings = require('../dataProviders/postgreSQL/models/GuildSettings');
const Case = require('../structures/Moderation');

exports.run = async (bot, member) => {
  // leaves/kicks
	const settings = await guildSettings.findOne({ where: { guildID: member.guild.id } });
	if (!settings) return;
	const logs = settings.logs;
	let rolestate = settings.rolestate;
	const mentions = settings.mentions;
	const leave = settings.leave;

	if (logs && logs.enable && logs.channel && logs.fields.leaves !== false) {
		let embed = new bot.methods.Embed();
		embed.setColor('#ff5050').setTimestamp().setAuthor(`${member.user.username} (${member.user.id})`, member.user.avatarURL).setFooter(bot.user.username, bot.user.avatarURL);
		/*
		if (mentions && mentions.enabled && mentions.action === 'kick') embed.addField('\u274C MENTION ABUSE KICK', `${member.user.username} has been removed from the server!`);
		else embed.addField('\u274C NEW LEAVE', `${member.user.username} has left or been kicked from the server!`);
		member.guild.channels.get(logs.channel).sendEmbed(embed).catch(() => null);
		*/
	}

	if (leave && leave.enabled === true && leave.channel) {
		member.guild.channels.get(leave.channel).send(leave.message.replace(/USER/g, member.displayName));
	}

	// rolestate
	if (rolestate && rolestate.enabled) {
		const bans = await member.guild.fetchBans().catch(null);
		if (!bans) return member.guild.owner.sendMessage(`\uD83D\uDEAB I do not have access to the banned members of server: \`${member.guild.name}\`. Please give me the \`ban members\` or \`administrator\` permission for rolestate to work!`); // eslint-disable-line consistent-return
		if (bans.has(member.id)) return;
		if (!rolestate.users) rolestate.users = {};
		rolestate.users[member.id] = member.roles.map(role => role.id);
		settings.rolestate = rolestate;
		await settings.save().catch(console.error);
		return;
	}

	// modlogs
	/*
	const mod = new Case(null, member, null, 'kick');
	const channel = await mod.getChannel().catch(null);
	if (channel) {
		mod.addCase();
		const embed = new bot.methods.Embed();
		embed.setAuthor(mod.getMod('user'), mod.getMod('avatar'));
		embed.setDescription(mod.formatDescription());
		embed.setFooter(mod.formatFooter());
		embed.setColor(mod.getColor());
		await member.guild.channels.get(channel).sendEmbed(embed);
	}
	*/
};
