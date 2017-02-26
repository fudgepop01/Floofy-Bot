const { Command } = require('discord.js-commando');

module.exports = class MuteUserCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mute',
			group: 'mod',
			memberName: 'mute',
			description: 'Mutes a user.',
			guildOnly: true,

			args: [
				{
					key: 'member',
					prompt: 'What user would you like to mute?\n',
					type: 'member'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_MESSAGES');
	}

	async run(msg, args) {
		const member = args.member;
		const user = member.user;
		if (member.id === msg.author.id) return msg.say('I don\'t think you want to mute yourself.');
		const botMember = await msg.guild.fetchMember(msg.client.user);
		if (!botMember.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return msg.reply('I do not have the `manage roles` permission.');
		const settings = this.client.provider.get(msg.guild, 'muted', []);
		if (settings.includes(member.id)) return msg.say(`The user ${member.id} is already muted.`);
		if (!msg.guild.roles.has(msg.guild.roles.find('name', 'Muted')).id) await msg.guild.createRole({ name: 'Muted', position: 0 }).then(() => msg.reply('A role `Muted` has been created. Make sure it\'s sorted correctly (ideally at the top)!'));
		settings.push(member);
		this.client.provider.set(msg.guild.id, 'muted', settings);
		await member.addRoles([msg.guild.roles.find('name', 'Muted')]);
		return msg.reply(`I have successfully muted ${user.username}.`);
		// mod logs
	}
};
