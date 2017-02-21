const guildSettings = require('../dataProviders/postgreSQL/models/GuildSettings');

exports.run = async (bot, member) => {
  // joined
	let d = new Date();
	let rolestate = bot.provider.get(member.guild, 'rolestate'); // unsure if provider is enough
	const logs = bot.provider.get(member.guild, 'logs'); // unsure if provider is enough
	const settings = await guildSettings.findOne({ where: { guildID: member.guild.id } });
	const welcome = settings.welcome;

	if (logs && logs.enabled && logs.channel && logs.fields.joins !== false) {
		let embed = new bot.methods.Embed();
    // TODO: say how old the account is, also improve code here, its fucking shit man
		embed.setColor('#66ff99').setTimestamp(new Date()).setAuthor(`${member.user.username} (${member.user.id})`, member.user.avatarURL);
		if ((d.getTime() - member.user.createdAt.getTime()) <= 86400000) embed.addField('\u26A0\uFE0F NEW ACCOUNT JOIN', `${member.user.username} has joined the server!`);
		else embed.addField('\u2705 NEW JOIN', `${member.user.username} has joined the server!`);
		embed.setFooter(bot.user.username, bot.user.avatarURL);
		member.guild.channels.get(logs.channel).sendEmbed(embed).catch(() => null);
	}
	/*
	// AUTOBANS
	if (bans && bans.includes(member.user.id)) {
		member.guild.ban(member.user, 7).catch(() => {
			member.guild.owner.sendMessage(`\u274C I do not have sufficient permissions to autoban the user \`${member.id}\` who just joined the server \`${member.guild.name}\`, you will have to ban the user yourself.`);
		});
		bans.splice(bans.indexOf(member.user.id), 1);
		bot.provider.set(member.guild, 'bans', bans);
	}
	*/

  // welcome messages
	if (welcome && welcome.enabled) {
		if (welcome.pm && welcome.pm.enabled === true && welcome.pm.message) member.sendMessage(welcome.pm.message.replace(/\[user\]/g, member));

		if (welcome.public && welcome.public.enabled === true && welcome.public.message) {
			if (welcome.public.channel && member.guild.channels.get(welcome.public.channel)) member.guild.channels.get(welcome.public.channel).sendMessage(welcome.public.message.replace(/USER/g, member));
			else member.guild.owner.sendMessage(`You seem to have welcome messages enabled, but not configured properly. A new member joined in\`${member.guild.name}\`but a valid channel is not set! Please set a valid channel for welcome messages in\`${member.guild.name}\`!`);
		}
	}
	// ROLESTATE
	if (rolestate && rolestate.enabled === true && rolestate.users && rolestate.users[member.id]) {
		let numDeletedRoles = 0;
		let roles = rolestate.users[member.id].map(roleid => {
			if (member.guild.roles.has(roleid)) {
				if (member.guild.roles.get(roleid).name !== '@everyone') return roleid;
			}	else { numDeletedRoles++; }
		});
		member.addRoles(roles).then(() => {
			if (logs && logs.channel && logs.enabled) {
				let embed = new bot.methods.Embed();
				embed.setColor('#3333ff').setTimestamp(new Date()).setAuthor(`${member.user.username} (${member.user.id})`, member.user.avatarURL).setFooter(bot.user.username, bot.user.avatarURL);
				embed.addField('\u26A0\uFE0F ROLESTATE', `I have reinstated the roles for \`${member.user.username}#${member.user.discriminator}\`.`);
				if (numDeletedRoles !== 0) embed.addField(`I found that there were \`${numDeletedRoles}\` deleted role(s).`);
				member.guild.channels.get(logs.channel).sendEmbed(embed).catch(() => null);
			}
			delete rolestate.users[member.id];
			settings.rolestate = rolestate;
			return settings.save();
			// bot.provider.set(member.guild, 'rolestate', rolestate);
		}).catch(() => {
			let roleNames = rolestate.users[member.id].map(roleid => {
				let role = member.guild.roles.get(roleid);
				if (member.guild.roles.has(role.id)) {
					if (role.name !== '@everyone') return role.name;
				}	else { return 'DELETED ROLE'; }
			});
			member.guild.owner.sendMessage(`\uD83D\uDEAB I do not have permissions to reinstate the roles for ${member} in the server \`${member.guild.name}\`. Here are the roles I remembered for this user:\n\`${roleNames.join(', ').substring(2)}\`.`).then(() => {
				delete rolestate.users[member.id];
				// settings.rolestate = rolestate;
				// return settings.save();
				bot.provider.set(member.guild, 'rolestate', rolestate);
			});
		});
	}
};
