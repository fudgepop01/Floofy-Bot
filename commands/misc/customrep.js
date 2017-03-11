const { Command } = require('discord.js-commando');
const GuildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');
const superagent = require('superagent');
const { token, baseURL } = require('../../settings').lolisafe;

module.exports = class CustomReputationCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'customrep',
			group: 'misc',
			memberName: 'customrep',
			description: 'Sets a custom reputation currency.',
			guildOnly: true,
			examples: [
				'customrep Star Bits'
			],
			args: [
				{
					key: 'name',
					prompt: 'What should the custom reputation currency be??\n',
					type: 'string'
				},
				{
					key: 'image',
					prompt: 'What should the custom image be for the reputation currency? (Please specify a direct image URL)\n',
					type: 'string',
					validate: (url) => {
						return url.match(/\.(png|jpg|jpeg|gif|webp)$/);
					},
					defaultValue: null
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(msg, args) {
		const { name, image } = args;
		const settings = await GuildSettings.findOne({ where: { guildID: msg.guild.id } }) || await GuildSettings.create({ guildID: msg.guild.id });
		settings.customRep = name;

		if (args.image) {
			const link = image;
			const dir = path.join(__dirname, '..', '..', 'assets', 'upload.jpg');

			const res = await request.defaults({ encoding: null })(link).catch(() => null);
			fs.writeFileSync(dir, res);
			const resImage = await superagent
				.post(`${baseURL}/api/upload`)
				.set('Content-Type', 'multipart/form-data')
				.type('files[]')
				.set('token', token)
				.attach('files[]', dir)
				.catch(() => null);
			// i need a domain name

			if (resImage) settings.customRepImage = `http://${resImage.body.files[0].url}`;
			else return msg.reply('Failed to request image.');
		}

		await settings.save().catch(console.error);
		return msg.reply(`I have successfully updated the custom reputation currency.`);
	}
};
