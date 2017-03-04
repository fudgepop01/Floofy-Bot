const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const Case = require('../../structures/Moderation');

module.exports = class ReasonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reason',
			group: 'mod',
			memberName: 'reason',
			description: 'Updates a case.',
			guildOnly: true,

			args: [
				{
					key: 'case',
					prompt: 'What case would you like to modify?\n',
					type: 'integer'
				},
				{
					key: 'reason',
					prompt: 'What should the new warning be?\n',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.options.owner === msg.author.id;
	}

	async run(msg, args) {
		const member = args.member;
		if (msg.author.id === member.user.id) return msg.channel.send('If you try to warn yourself, you\'re gonna have a *baaad* time.');
		if (msg.client.funcs.isStaff(member)) return msg.channel.send('You cannot warn a fellow staff member!');

		const mod = new Case(msg.author, member, args.reason, 'warning');
		const channel = await mod.getChannel().catch(null);
		if (!channel) return msg.reply('There is no channel for modlogs set.');

		mod.updateCase(member, args.reason);
		let message = await msg.channel.send('Updating case...');
		const embed = new this.client.methods.Embed();
		embed.setAuthor(mod.getMod('user'), mod.getMod('avatar'));
		embed.setDescription(mod.formatDescription());
		embed.setFooter(mod.formatFooter());
		embed.setColor(mod.getColor());
		const caseMessage = await msg.guild.channels.get(channel).fetchMessage(mod.getCaseMessageID());

		caseMessage.edit('', {
			embed: {
				description: stripIndents`
        	**User**: user
          **Action**: kick
          **Reason**: newReason`
			}
		});

		await member.send(`You've received a warning in ${msg.guild.name}.\n\`Reason:\` ${args.reason}`);
		await mod.saveCase();
		return message.edit(`Successfully warned ${member.user.username}.`);
	}
};
