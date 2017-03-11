const guildSettings = require('../dataProviders/postgreSQL/models/GuildSettings');

exports.run = async (bot, member) => {
  // joined
	let date = new Date();
	const settings = await guildSettings.findOne({ where: { guildID: member.guild.id } });
	if (!settings) return;
	const welcome = settings.welcome;
	const logs = settings.logs;
	let rolestate = settings.rolestate;

	if (logs && logs.enabled && logs.channel && logs.fields ? logs.fields.joins !== false : !logs.fields && member.guild.channels.has(logs.channel)) {
		let embed = new bot.methods.Embed();
    // TODO: say how old the account is, also improve code here, its fucking shit man
		embed.setColor('#66ff99').setTimestamp(new Date()).setAuthor(`${member.user.username} (${member.user.id})`, member.user.avatarURL);
		if ((date.getTime() - member.user.createdAt.getTime()) <= 86400000) embed.addField('\u26A0\uFE0F NEW ACCOUNT JOIN', `${member.user.username} has joined the server!`);
		else embed.addField('\u2705 NEW JOIN', `${member.user.username} has joined the server!`);
		embed.setFooter(bot.user.username, bot.user.avatarURL);
		member.guild.channels.get(logs.channel).sendEmbed(embed).catch(() => null);
	}

  // welcome messages
	if (welcome && welcome.enabled === true) {
		if (welcome.pm && welcome.pm.enabled === true && welcome.pm.message && member.guild.channels.has(logs.channel)) member.sendMessage(welcome.pm.message.replace(/\[user\]/g, member));

		if (welcome.public && welcome.public.enabled !== false && welcome.public.message) {
			if (welcome.public.channel && member.guild.channels.get(welcome.public.channel)) member.guild.channels.get(welcome.public.channel).sendMessage(welcome.public.message.replace(/USER/g, member));
			else member.guild.owner.sendMessage(`You seem to have welcome messages enabled, but not configured properly. A new member joined in\`${member.guild.name}\`but a valid channel is not set! Please set a valid channel for welcome messages in\`${member.guild.name}\`!`);
		}
	}
	// ROLESTATE
	if (rolestate && rolestate.enabled && rolestate.users && rolestate.users[member.id]) {
		let numDeletedRoles = 0;
		let roles = rolestate.users[member.id].map(roleid => {
			if (member.guild.roles.has(roleid)) {
				if (member.guild.roles.get(roleid).name !== '@everyone') return roleid;
			}	else { numDeletedRoles++; }
		});
		member.addRoles(roles).then(async () => {
			if (logs && logs.channel && logs.enabled && member.guild.channels.has(logs.channel)) {
				let embed = new bot.methods.Embed();
				embed.setColor('#3333ff').setTimestamp(new Date()).setAuthor(`${member.user.username} (${member.user.id})`, member.user.avatarURL).setFooter(bot.user.username, bot.user.avatarURL);
				embed.addField('\u26A0\uFE0F ROLESTATE', `I have reinstated the roles for \`${member.user.username}#${member.user.discriminator}\`.`);
				if (numDeletedRoles !== 0) embed.addField(`I found that there were \`${numDeletedRoles}\` deleted role(s).`);
				member.guild.channels.get(logs.channel).sendEmbed(embed).catch(() => null);
			}
			delete rolestate.users[member.id];
			settings.rolestate = rolestate;
			await settings.save();
		}).catch(async () => {
			let roleNames = rolestate.users[member.id].map(roleid => {
				let role = member.guild.roles.get(roleid);
				if (member.guild.roles.has(role.id)) {
					if (role.name !== '@everyone') return role.name;
				}	else { return 'DELETED ROLE'; }
			});
			await member.guild.owner.sendMessage(`\uD83D\uDEAB I do not have permissions to reinstate the roles for ${member} in the server \`${member.guild.name}\`. Here are the roles I remembered for this user:\n\`${roleNames.join(', ').substring(2)}\`.`);
			delete rolestate.users[member.id];
			settings.rolestate = rolestate;
			settings.save();
			await settings.save();
		});
	}
};
