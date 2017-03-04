const { Command } = require('discord.js-commando');
const { paypal } = require('../../settings');

module.exports = class DonateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'donate',
			group: 'util',
			memberName: 'donate',
			description: 'Brings up a donation link.',
			details: 'Disclaimer: no additional services will be provided, except maybe lots of love and thank-yous!'
		});
	}

	hasPermission(msg) {
		return this.client.options.owner === msg.author.id;
	}

	async run(msg) {
		const owner = this.client.users.get(this.client.options.owner);
		const embed = new this.client.methods.Embed();
		embed.setDescription(`Click [here OwO](${paypal}) to donate to help provide for service costs! (It isn't cheap!)`);
		embed.setImage('https://www.paypalobjects.com/webstatic/en_US/i/btn/png/blue-pill-paypal-60px.png');
		embed.setAuthor(`${owner.username}#${owner.discriminator}`, owner.avatarURL, paypal);
		embed.setFooter(this.client.user.username, this.client.user.avatarURL);
		embed.setColor('#cc0000');
		return msg.channel.sendEmbed(embed);
	}
};
