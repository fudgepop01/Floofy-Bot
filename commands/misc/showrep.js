const { Command, util } = require('discord.js-commando');

const config = require('../../settings');
const UserRep = require('../../dataProviders/postgreSQL/models/UserRep');
const GuildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class RepShowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'showrep',
			aliases: ['show-rep', 'rep-show'],
			group: 'misc',
			memberName: 'showrep',
			description: 'Display the reputation a user has received from other people.',
			guildOnly: true,

			args: [
				{
					key: 'page',
					prompt: 'which page do you want to view?',
					type: 'integer',
					default: 1
				}
			]
		});
	}

	async run(msg, args) {
		const page = args.page;

		const settings = await GuildSettings.find({ where: { guildID: msg.guild.id } }) || await GuildSettings.create({ guildID: msg.guild.id });
		const reputation = await UserRep.findAll({ where: { userID: msg.author.id } });
		const positive = reputation.filter(rep => rep.reputationType.trim() === '+').length;
		// const negative = reputation.length - positive;

		const paginated = util.paginate(reputation, page, 5);

		const reputationMessages = paginated.items.map(rep => ({
			name: `[ ${rep.reputationType.trim()} ] ${this.client.users.get(rep.reputationBy).username}`,
			value: rep.reputationMessage || '*-no message-*'
		}));
		const icon = await this.client.funcs.averageRGB(msg.author.avatarURL).catch(() => null);
		const embed = {
			// color: positive > negative ? 0x52C652 : 0xE93F3C,
			color: parseInt(icon.slice(1), 16),
			author: {
				name: `${msg.member.displayName}`,
				icon_url: msg.author.displayAvatarURL // eslint-disable-line camelcase
			},
			thumbnail: { url: settings.customRepImage ? settings.customRepImage : null },
			fields: [
				{
					name: `Positive ${settings.customRep ? settings.customRep : ' Reputation'}`,
					value: positive.toString(),
					inline: true
				},
				/*
				{
					name: `Negative ${settings.customRep ? settings.customRep : ' Reputation'}`,
					value: negative.toString(),
					inline: true
				},*/
				...reputationMessages
			],
			footer: { text: paginated.maxPage > 1 ? `Use ${msg.usage()} to view a specific page.` : '' }
		};

		return msg.embed(embed);
	}
};
