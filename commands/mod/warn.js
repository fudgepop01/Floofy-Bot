const { Command } = require('discord.js-commando');
const Case = require('../../structures/Moderation');

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
					key: 'reason',
					prompt: 'What are you warning this user for?\n',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		// return msg.client.funcs.isStaff(msg.member);
		return this.client.options.owner === msg.author.id;
	}

	async run(msg, args) {
		const member = args.member;
		if (msg.author.id === member.user.id) return msg.channel.send('If you try to warn yourself, you\'re gonna have a *baaad* time.');
		if (msg.client.funcs.isStaff(member)) return msg.channel.send('You cannot warn a fellow staff member!');

		const mod = new Case(msg.author, member, args.reason, 'warning');
		const channel = await mod.getChannel().catch(null);
		if (!channel) return msg.reply('There is no channel for modlogs set.');

		mod.addCase();
		let message = await msg.channel.send('Warning user...');
		const embed = new this.client.methods.Embed();
		embed.setAuthor(mod.getMod('user'), mod.getMod('avatar'));
		embed.setDescription(mod.formatDescription());
		embed.setFooter(mod.formatFooter());
		embed.setColor(mod.getColor());
		const caseMessage = await msg.guild.channels.get(channel).sendEmbed(embed);
		mod.addCaseMessageID(caseMessage.id);

		await member.send(`You've received a warning in ${msg.guild.name}.\n\`Reason:\` ${args.reason}`);
		await mod.saveCase();
		return message.edit(`Successfully warned ${member.user.username}.`);
	}
};
