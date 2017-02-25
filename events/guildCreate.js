exports.run = (bot, server) => {
	// server.client.database.initGuild(server);
	bot.channels.get('189630078206869505').sendMessage(`Joined ${server.name.replace(/@(everyone|here)/g, '@\u200b$1')} (${server.id})`);
};
