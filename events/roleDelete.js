const guildSettings = require('../dataProviders/postgreSQL/models/GuildSettings');

exports.run = async (bot, role) => {
	const settings = await guildSettings.findOne({ where: { guildID: role.guild.id } });
	if (!settings) return;
	let flairs = settings.flairs;
	if (flairs && flairs.includes(role.id)) {
		flairs.splice(flairs.indexOf(role.id), 1);
		settings.flairs = flairs;
		settings.save().catch(console.error);
	}
};
