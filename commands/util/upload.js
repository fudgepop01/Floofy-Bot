const { Command } = require('discord.js-commando');
const fs = require('fs');
const path = require('path');
const superagent = require('superagent');
const request = require('request-promise-native');
const { token, baseURL } = require('../../settings').lolisafe;


module.exports = class UploadCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'upload',
			group: 'util',
			memberName: 'upload',
			description: 'Uploads a picture to lolisafe',
			argsPromptLimit: 0,

			args: [
				{
					key: 'image',
					prompt: 'What image would you like to upload?\n',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.author.id === this.client.options.owner;
	}

	async run(msg, args) {
		const link = args.image;
		const dir = path.join(__dirname, '..', '..', 'assets', 'upload.jpg');

		const res = await request.defaults({ encoding: null })(link).catch(() => null);
		fs.writeFileSync(dir, res);
		// const file = fs.readFileSync(dir);

		superagent
		.post(`${baseURL}/api/upload`)
		.set('Content-Type', 'multipart/form-data')
		.type('files[]')
		.set('token', token)
		.attach('files[]', dir)
		.then(img => msg.channel.sendFile(`http://${img.body.files[0].url}`))
		.catch(null);
		// i need a domain name
	}
};
