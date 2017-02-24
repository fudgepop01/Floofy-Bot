const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class NSFWChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nsfwchannel',
			group: 'nsfw',
			memberName: 'nsfwchannel',
			description: 'Adds or removes a channel for NSFW commands.',
			guildOnly: true,
			examples: [
				'nsfwchannel nsfw_channel'
			],
			args: [
				{
					key: 'channel',
					prompt: 'What channel would you like to set?\n',
					type: 'channel'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(msg, args) {
		let settings = await guildSettings.findOne({ where: { guildID: msg.guild.id } });
		if (!settings) settings = await guildSettings.create({ guildID: msg.guild.id });
		let nsfw = settings.nsfw;
		if (!nsfw.channels) nsfw.channels = [];
		if (nsfw.channels.includes(args.channel.id)) nsfw.channels.splice(nsfw.channels.indexOf(args.channel.id));
		else nsfw.channels.push(args.channel.id);
		settings.nsfw = nsfw;
		await settings.save().catch(console.error);
		return msg.reply(`I have ${nsfw.channels.includes(args.channel.id) ? 'permitted' : 'blocked'} NSFW in ${args.channel}.`);
	}
};
