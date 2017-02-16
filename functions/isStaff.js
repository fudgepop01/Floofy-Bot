module.exports = (member) => {
	const permissions = member.permissions.serialize();
	return (
    permissions.KICK_MEMBERS
    || permissions.BAN_MEMBERS
    || permissions.ADMINISTRATOR
    || permissions.MANAGE_CHANNELS
    || permissions.MANAGE_GUILD
    || permissions.MANAGE_MESSAGES
	);
};
