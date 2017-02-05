exports.run = (bot, server) => {
	// server.client.database.initGuild(server);
	bot.channels.get('189630078206869505').sendMessage(`Joined ${server.name} (${server.id})`);
};
