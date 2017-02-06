const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

module.exports = class WarnCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'warn',
			group: 'mod',
			memberName: 'warn',
			description: 'Warns a user.',
			guildOnly: true,

			args: [
				{
					key: 'member',
					prompt: 'What user would you like to warn?\n',
					type: 'member'
				},
				{
					key: 'warning',
					prompt: 'What are you warning this user for?\n',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.client.funcs.isStaff(msg.member);
	}

	async run(msg, args) {
		let member = args.member;
		let user = args.member.user;
		let warning = args.warning;
		if (msg.author.id === user.id) return msg.channel.send('If you try to warn yourself you\'re gonna have a *baaad* time.');
		if (msg.client.funs.isStaff(member)) return msg.channel.send('You cannot warn a fellow staff member!');
		let warnings = msg.client.provider.get(msg.guild, 'warnings', new msg.client.methods.Collection());
		warnings.users.set(member.user.id, warning);
		msg.client.provider.get(msg.guild, 'warnings', warnings);
		const modlogs = msg.client.provider.get(msg.guild, 'modlogs', {});
		let message = await msg.channel.send('Warning user...');
		await msg.guild.channels.get(modlogs.channel).sendEmbed({
			description: stripIndents`
			**User**: ${user.username}#${user.discriminator} (${user.id})
			**Action**: Warn
			**Reasion**: ${warning}`
		});
		if (modlogs.channel) await msg.guild.channels.get(modlogs.channel).send(`${user.username}#${user.discriminator} has received a warning: \`${warning}\``);
		await member.sendMessage(`You've received a warning in ${msg.guild.name}.\n\`Reason:\` ${warning}`);
		return message.edit(`Successfully warned ${user.username}.`);
	}
};
