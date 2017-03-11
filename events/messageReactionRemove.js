const guildSettings = require('../dataProviders/postgreSQL/models/GuildSettings');

exports.run = async (bot, messageReaction, user) => {
	const message = messageReaction.message;
	const settings = await guildSettings.findOne({ where: { guildID: message.guild.id } });

	if (!message.guild || !message.guild.member(user)) return;
	if (!settings.reactions || !settings.reactions.enabled || message.channel.id !== settings.reactions.channel) return;

	const channel = bot.channels.get(settings.reactions.channel);
	const msgs = await channel.fetchPinnedMessages().catch(err => console.error(err)) || channel.messages;
	const pinned = msgs.first().id;
	const emoji = messageReaction.emoji.hasOwnProperty('id') ? messageReaction.emoji.id : messageReaction.emoji;

	if (message.id !== bot.channels.get(settings.reactions.channel).messages.first().id && messageReaction.message.id !== pinned) return;
	if (!settings.reactions.roles[settings.reactions.emojis.indexOf(emoji)]) return messageReaction.message.channel.sendMessage('There is no role assigned to this reaction!');

	const role = message.guild.roles.get(settings.reactions.roles[settings.reactions.emojis.indexOf(emoji)]);
	const member = await message.guild.fetchMember(user);
	if (!member.roles.has(role.id)) return;

	await member.removeRole(settings.reactions.roles[settings.reactions.emojis.indexOf(emoji)]).catch(() => null);
  // might add perms check/feedback to config
	return messageReaction.message.channel.sendMessage(`I have successfully added ${role} to ${member.username} via reaction!`).then(msg => msg.delete(10000).catch(() => null));
};
