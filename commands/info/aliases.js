const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const Username = require('../../dataProviders/postgreSQL/models/Username');

module.exports = class UserInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'aliases',
			group: 'info',
			memberName: 'aliases',
			description: 'Get a user\'s past usernames.',
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'member',
					prompt: 'what user would you like to have information on?\n',
					type: 'member'
				}
			]
		});
	}

	async run(msg, args) {
		const Usernames = await Username.findAll({ where: { userID: args.member.id } });
		return msg.channel.send(stripIndents`
			Alises for the user ${args.member.displayName}:
			Aliases: ${Usernames.length ? Usernames.map(uName => uName.username).join(', ') : args.member.user.username}
			`, { split: true });
	}
};
