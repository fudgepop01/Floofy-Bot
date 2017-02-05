exports.run = (bot, server) => {
	if (!server.available) return;
	bot.channels.get('189630078206869505').sendMessage(`Left ${server.name} (${server.id})`);
};
