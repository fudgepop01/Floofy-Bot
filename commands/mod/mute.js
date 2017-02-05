const { Command } = require('discord.js-commando');

module.exports = class UserInfoCommand extends Command {
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

	async run(message, args) {
		if (args.member.id === message.author.id) return message.channel.send('I don\'t think you want to mute yourself.');
		let botMember = await message.guild.fetchMember(message.client.user);
		if (!botMember.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return message.reply('I do not have the `manage roles` permission.');
		let settings = this.client.provider.get(message.guild, 'muted', []);
		if (settings.includes(args.member.id)) return message.channel.send(`The user ${args.member.id} is already muted.`);
		if (!message.guild.roles.has(message.guild.roles.find('name', 'Muted')).id) await message.guild.createRole({ name: 'Muted', position: 0 }).then(() => message.reply('A role `Muted` has been created. Make sure it\'s sorted correctly (ideally at the top)!'));
		settings.push(args.member);
		this.client.provider.set(message.guild.id, 'muted', settings);
		await args.member.addRoles([message.guild.roles.find('name', 'Muted')]);
		return message.reply(`I have successfully muted ${args.user.username}.`);
		// mod logs
	}
};
