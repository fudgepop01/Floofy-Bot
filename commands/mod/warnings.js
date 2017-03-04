const { Command } = require('discord.js-commando');
const Case = require('../../structures/Moderation');
const { stripIndents } = require('common-tags');
const moment = require('moment');

module.exports = class ViewHistoryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'warnings',
			group: 'mod',
			memberName: 'warnings',
			description: 'Views a history of the user\'s infractions.',
			guildOnly: true,

			args: [
				{
					key: 'member',
					prompt: 'What user would you like to view the warnings of?\n',
					type: 'member'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.options.owner === msg.author.id;
	}

	async run(msg, args) {
		const mod = new Case();
		const embed = new this.client.methods.Embed();
		embed.setAuthor(`${args.member.user.username}#${args.member.user.discriminator}`, args.member.user.avatarURL);
		embed.setDescription(mod.viewWarnings());
		return msg.channel.sendEmbed(embed);
	}
};
