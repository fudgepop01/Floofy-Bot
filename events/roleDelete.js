exports.run = (bot, role) => {
	let imRoles = bot.provider.get(role.guild, 'imRoles');
	if (imRoles && imRoles.includes(role.id)) {
		imRoles.splice(imRoles.indexOf(role.id), 1);
		bot.provider.set(role.guild, 'imRoles');
	}
};
