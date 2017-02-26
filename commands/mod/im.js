const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class ImRoleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'im',
			group: 'mod',
			memberName: 'im',
			description: 'Gives yourself a role.',
			guildOnly: true,

			args: [
				{
					key: 'role',
					prompt: 'What role would you like to assign yourself?\n',
					type: 'role'
				}
			]
		});
	}

	async run(msg, args) {
		let settings = await guildSettings.findOne({ where: { guildID: msg.guild.id } });
		if (!settings || !settings.flairs || !settings.flairs.roles) return msg.reply('There are no self-assignable roles set up.');
		let flairs = settings.flairs.roles;
		if (!flairs.includes(args.role.id)) return msg.reply(`the role ${args.role.name} is not available as a self-assignable role.`);
		const botMember = await msg.guild.fetchMember(this.client.user);
		if (!botMember.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return msg.reply('I do not have the `manage roles` permission.');
		// const role = msg.guild.roles.filter(ro => ro.name.toLowerCase() === role.toLowerCase()).first()
		const member = await msg.guild.fetchMember(msg.author);
		if (!member.roles.has(args.role.id)) {
			await member.addRoles([args.role]);
			return msg.reply(`I have given you the role \`${args.role.name}\`.`);
		}	else {
			await member.removeRoles([args.role]);
			return msg.reply(`I have removed the role \`${args.role.name}\` from you.`);
		}
	}
};
