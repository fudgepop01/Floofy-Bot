const { Command } = require('discord.js-commando');

module.exports = class WelcomeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'welcome',
			group: 'config',
			memberName: 'welcome',
			description: 'Sets a welcome message for users when they join.',
			guildOnly: true,
			argsPromptLimit: 0,
			examples: [
				'welcome public channel 123456789',
				'welcome enable',
				'welcome pm disable',
				'welcome public enable',
				'welcome public Welcome, [user]!',
				'welcome pm Hello there! please take a moment to look at our rules!'
			]
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(message) {
		const args = message.content.toLowerCase().split(' ');
		const settings = this.client.provider.get(message.guild, 'welcome', {});
		if (['enable', 'disable'].includes(args[1])) {
			settings.enabled = args[1] === 'enable';
			return message.channel.send(`Welcome messages have been ${args[1] === 'enable' ? 'enabled' : 'disabled'}.`);
		}
		if (['pm', 'public'].includes(args[1])) {
			if (!settings[args[2]]) settings[args[2]] = {};
			if (['enable', 'disable'].includes(args[2])) {
				settings[args[1]].enabled = args[2] === 'enable';
				return message.channel.sendMessage(`${args[1].capitalize} welcome messages have been ${args[2] === 'enable' ? 'enabled' : 'disabled'}.`);
			}
			if ((args[1] === 'public') && (args[2] === 'channel')) {
				// ;wecome public channel <channel>
				if (!args[3]) {
					return message.channel.send('Usage: `config welcome public channel id`');
				} else {
					let channel = message.client.channels.get(args[3]);
					if (!channel) channel = message.guild.channels.find('name', args[3]);
					if (!channel) channel = message.mentions.channels.first();
					if (!channel) return message.channel.sendMessage('Please input a valid channel.');
					if (!settings.public) settings.public = {};
					settings.public.channel = channel.id;
					return message.channel.send(`The messages channel has been set to ${channel}.`);
				}
			}
			if (args[2]) {
				// ;welcome public/pm message
				let msg = args.join(' ');
				msg = msg.slice(msg.indexOf(msg.split(' ')[2]));
				// if (!sconfig.leave[args[1]]) sconfig.leave[args[1]] = {};
				settings[args[1]].message = msg;
				return message.channel.send(`The ${args[1]} message has been set to:\n\`${msg.replace(/\[user]/g, 'USER')}\``);
			}
			return message.channel.send(`Usage: \`welcome ${args[2]} enable/disable/message/channel\``);
		}
		this.client.provider.set(message.guild.id, 'filter', settings);
		return null;
	}
};

String.prototype.capitalize = () => { return this.charAt(0).toUpperCase() + this.slice(1); };
