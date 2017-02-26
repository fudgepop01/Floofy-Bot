const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');
const { stripIndents } = require('common-tags');
const moment = require('moment');

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
		const member = args.member;
		const user = member.user;
		if (msg.author.id === user.id) return msg.channel.send('If you try to warn yourself, you\'re gonna have a *baaad* time.');
		if (msg.client.funcs.isStaff(member)) return msg.channel.send('You cannot warn a fellow staff member!');
		let settings = await guildSettings.findOne({ where: { guildID: msg.guild.id } });
		if (!settings) settings = await guildSettings.create({ guildID: msg.guild.id });
		const channel = mod.logchannel;
		if (!channel) return msg.reply('There is no channel for modlogs set.');
		let mod = settings.mod;
		const warning = args.warning;

		mod.cases ? mod.cases++ : mod.cases = 1;
		if (!mod.warnings) mod.warnings = new this.client.methods.Collection();
		let count = mod.warnings.filter(u => u === member.id).size;
		mod.warnings.set(mod.cases, {id: member.id, warning: warning, count: count++});
		// unsure on ideal structure here still

		//need to make a class or some shit for the embed stuff
		let message = await msg.channel.send('Warning user...');
		await msg.guild.channels.get(channel).sendEmbed({
			author: {
				name: `${msg.author.username}#${msg.author.discriminator}`,
				icon: msg.author.displayAvatarURL
			},
			description: stripIndents`
			**User**: ${user.username}#${user.discriminator} (${user.id})
			**Action**: Warn
			**Reasion**: ${warning}`,
			footer: `${mod.cases} | ${moment(new Date()).format('DD/MM/YYYY @ hh:mm:ss a')}`
		});

		settings.mod = mod;
		await settings.save().catch(console.error);
		await member.send(`You've received a warning in ${msg.guild.name}.\n\`Reason:\` ${warning}`);
		return message.edit(`Successfully warned ${user.username}.`);
	}
};
