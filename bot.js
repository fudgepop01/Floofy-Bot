// global.Promise = require('bluebird');

const commando = require('discord.js-commando');
const Discord = require('discord.js');

const Currency = require('./currency/Currency');
const Experience = require('./currency/Experience');
const starBoard = require('./dataProviders/postgreSQL/models/StarBoard');

const { oneLine } = require('common-tags');
const { URL } = require('url');
const path = require('path');
const Raven = require('raven');
const winston = require('./structures/Logger.js');


const memwatch = require('memwatch-next');
const heapdump = require('heapdump');
const cron = require('node-schedule');
const moment = require('moment-timezone');


const Database = require('./dataProviders/postgreSQL/PostgreSQL');
const Redis = require('./dataProviders/redis/Redis');
const SequelizeProvider = require('./dataProviders/postgreSQL/SequelizeProvider');
const config = require('./settings');
// const Thonk = require('./dataProviders/rethink/rethinkProvider');

const loadEvents = require('./functions/loadEvents.js');
const loadFunctions = require('./functions/loadFunctions.js');

const database = new Database();
const redis = new Redis();
const client = new commando.Client({
	owner: config.owner,
	commandPrefix: '.',
	unknownCommandResponse: false,
	disableEveryone: true,
	clientOptions: {
		shardCount: 'auto',
		disabledEvents: ['USER_NOTE_UPDATE', 'VOICE_STATE_UPDATE', 'TYPING_START', 'VOICE_SERVER_UPDATE']
	}
});

client.coreBaseDir = `${__dirname}/`;
client.clientBaseDir = `${process.cwd()}/`;

let earnedRecently = [];
let gainedXPRecently = [];

Raven.config(config.ravenKey).install();

database.start();
redis.start();

client.setProvider(new SequelizeProvider(database.db));

client.dispatcher.addInhibitor(msg => {
	if (msg.channel.topic && msg.channel.topic.includes('[block]')) return 'Command blocked because the topic contains [block].';
	return false;
});

client.dispatcher.addInhibitor(msg => {
	const blacklist = client.provider.get('global', 'userBlacklist', []);
	if (!blacklist.includes(msg.author.id)) return false;
	return `User ${msg.author.username}#${msg.author.discriminator} (${msg.author.id}) has been blacklisted.`;
});

client
	.on('error', console.error)
	.on('warn', winston.warn)
	.on('ready', async () => {
		winston.info(oneLine`
			Client ready... Logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})
		`);
		Currency.leaderboard();
		/*
		client.guildSettings = new Discord.Collection();
		client.database = new Thonk(client);
		client.database.initGuilds();
		*/
		await loadFunctions(client);
		await loadEvents(client);
		client.methods = {};
		client.methods.Collection = Discord.Collection;
		client.methods.Embed = Discord.RichEmbed;

		const guildSettings = require('./dataProviders/postgreSQL/models/GuildSettings');
		let settings, channel;
		for (let [, guild] of client.guilds) {
			settings = await guildSettings.findOne({ where: { guildID: guild.id } });
			// this should be in redis perhaps
			if (!settings || !settings.reactions) continue;
			channel = client.channels.get(settings.reactions.channel);
			if (!channel) continue;
			await channel.fetchMessages(10);
			await channel.fetchPinnedMessages();
		}


		// memory leag debug
		memwatch.on('leak', (info) => {
			console.error(info);
			const file = `./floofybot-${process.pid}-${Date.now()}.heapsnapshot`;
			heapdump.writeSnapshot(file, (err) => {
				if (err) console.error(err);
				else console.error(`Wrote snapshot: ${file}`);
			});
		});


		let servers = ` in ${client.guilds.size} servers!`;
		let users = ` with ${client.guilds.reduce((a, b) => a + b.memberCount, 0)} users!`;
		let games = [`type ${client.commandPrefix}help for commands!`, 'with database testing...', servers, `type ${client.commandPrefix}join to invite me!`, users];
		client.user.setGame(servers);
		setInterval(() => {
			servers = `in ${client.guilds.size} servers!`;
			client.user.setGame(games[Math.floor(Math.random() * games.length)]);
		}, Math.floor(Math.random() * (600000 - 120000 + 1)) + 120000);
	})
	.on('messageReactionAdd', async (messageReaction, user) => {
		if (messageReaction.emoji.name !== '⭐') return;

		const message = messageReaction.message;
		const starboard = message.guild.channels.find('name', 'starboard');
		if (!starboard) return;
		if (message.author.id === user.id) {
			messageReaction.remove(user.id);
			return message.channel.send(`${user}, you cannot star your own messages!`); // eslint-disable-line consistent-return
		}

		let settings = await starBoard.findOne({ where: { guildID: message.guild.id } });
		if (!settings) settings = await starBoard.create({ guildID: message.guild.id });
		const starred = settings.starred;

		if (starred.hasOwnProperty(message.id)) {
			if (starred[message.id].stars.includes(user.id)) return message.channel.send(`${user}, you cannot star the same message twice!`); // eslint-disable-line consistent-return
			const starCount = starred[message.id].count += 1;
			const starredMessage = await starboard.fetchMessage(starred[message.id].starredMessageID).catch(() => null); // eslint-disable-line
			const starredMessageContent = starred[message.id].starredMessageContent;
			const starredMessageAttachmentImage = starred[message.id].starredMessageImage;
			const starredMessageDate = starred[message.id].starredMessageDate;

			let edit;
			if ((starCount - 1) < 5) edit = starredMessage.embeds[0].footer.text.replace(`${starCount - 1} ⭐`, `${starCount} ⭐`);
			else if ((starCount - 1) >= 5 < 10) edit = starredMessage.embeds[0].footer.text.replace(`${starCount - 1} ⭐`, `${starCount} 🌟`);
			else if ((starCount - 1) >= 10) edit = starredMessage.embeds[0].footer.text.replace(`${starCount - 1} 🌟`, `${starCount} 🌠`);

			await starredMessage.edit({
				embed: {
					author: {
						icon_url: message.author.displayAvatarURL, // eslint-disable-line camelcase
						name: `${message.author.username}#${message.author.discriminator} (${message.author.id})`
					},
					color: 0xFFAC33,
					fields: [
						{
							name: 'ID',
							value: message.id,
							inline: true
						},
						{
							name: 'Channel',
							value: message.channel.toString(),
							inline: true
						},
						{
							name: 'Message',
							value: starredMessageContent ? starredMessageContent : '\u200B'
						}
					],
					image: { url: starredMessageAttachmentImage ? starredMessageAttachmentImage : undefined },
					timestamp: starredMessageDate,
					footer: { text: edit }
				}
			}).catch(() => null); // eslint-disable-line

			starred[message.id].count = starCount;
			starred[message.id].stars.push(user.id);
			settings.starred = starred;

			await settings.save();
		} else {
			const starCount = 1;
			let attachmentImage;
			const extensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);
			const linkRegex = /https?:\/\/(?:\w+\.)?[\w-]+\.[\w]{2,3}(?:\/[\w-_\.]+)+\.(?:png|jpg|jpeg|gif|webp)/; // eslint-disable-line no-useless-escape

			if (message.attachments.some(attachment => {
				try {
					const url = new URL(attachment.url);
					const ext = path.extname(url.pathname);
					return extensions.has(ext);
				} catch (err) {
					if (err.message !== 'Invalid URL') winston.error(err);
					return false;
				}
			})) attachmentImage = message.attachments.first().url;

			if (!attachmentImage) {
				const linkMatch = message.content.match(linkRegex);
				if (linkMatch) {
					try {
						const url = new URL(linkMatch[0]);
						const ext = path.extname(url.pathname);
						if (extensions.has(ext)) attachmentImage = linkMatch[0]; // eslint-disable-line max-depth
					} catch (err) {
						if (err.message === 'Invalid URL') winston.info('No valid image link.'); // eslint-disable-line max-depth
						else winston.error(err);
					}
				}
			}

			const sentStar = await starboard.send({
				embed: {
					author: {
						icon_url: message.author.displayAvatarURL, // eslint-disable-line camelcase
						name: `${message.author.username}#${message.author.discriminator} (${message.author.id})`
					},
					color: 0xFFAC33,
					fields: [
						{
							name: 'ID',
							value: message.id,
							inline: true
						},
						{
							name: 'Channel',
							value: message.channel.toString(),
							inline: true
						},
						{
							name: 'Message',
							value: message.content ? message.cleanContent.substring(0, 1000) : '\u200B'
						}
					],
					image: { url: attachmentImage ? attachmentImage.toString() : undefined },
					timestamp: message.createdAt,
					footer: { text: `${starCount} ⭐` }
				}
			}).catch(() => null); // eslint-disable-line

			starred[message.id] = {};
			starred[message.id].authorID = message.author.id;
			starred[message.id].starredMessageID = sentStar.id;
			starred[message.id].starredMessageContent = message.cleanContent;
			starred[message.id].starredMessageImage = attachmentImage || '';
			starred[message.id].starredMessageDate = message.createdAt;
			starred[message.id].count = starCount;
			starred[message.id].stars = [];
			starred[message.id].stars.push(user.id);
			settings.starred = starred;

			await settings.save();
		}
	})
	.on('messageReactionRemove', async (messageReaction, user) => {
		if (messageReaction.emoji.name !== '⭐') return;

		const message = messageReaction.message;
		const starboard = message.guild.channels.find('name', 'starboard');
		if (!starboard) return;

		const settings = await starBoard.findOne({ where: { guildID: message.guild.id } });
		if (!settings) return;
		let starred = settings.starred;

		if (!starred.hasOwnProperty(message.id)) return;
		if (!starred[message.id].stars.includes(user.id)) return;

		const starCount = starred[message.id].count -= 1;
		const starredMessage = await starboard.fetchMessage(starred[message.id].starredMessageID).catch(() => null); // eslint-disable-line

		if (starred[message.id].count === 0) {
			delete starred[message.id];
			await starredMessage.delete().catch(() => null); // eslint-disable-line
		} else {
			const starredMessageContent = starred[message.id].starredMessageContent;
			const starredMessageAttachmentImage = starred[message.id].starredMessageImage;
			const starredMessageDate = starred[message.id].starredMessageDate;

			let edit;
			if ((starCount + 1) < 5) edit = starredMessage.embeds[0].footer.text.replace(`${starCount + 1} ⭐`, `${starCount} ⭐`);
			else if ((starCount + 1) >= 5 < 10) edit = starredMessage.embeds[0].footer.text.replace(`${starCount + 1} 🌟`, `${starCount} ⭐`);
			else if ((starCount + 1) >= 10) edit = starredMessage.embeds[0].footer.text.replace(`${starCount + 1} 🌠`, `${starCount} 🌟`);

			await starredMessage.edit({
				embed: {
					author: {
						icon_url: message.author.displayAvatarURL, // eslint-disable-line camelcase
						name: `${message.author.username}#${message.author.discriminator} (${message.author.id})`
					},
					color: 0xFFAC33,
					fields: [
						{
							name: 'ID',
							value: message.id,
							inline: true
						},
						{
							name: 'Channel',
							value: message.channel.toString(),
							inline: true
						},
						{
							name: 'Message',
							value: starredMessageContent ? starredMessageContent : '\u200B'
						}
					],
					image: { url: starredMessageAttachmentImage ? starredMessageAttachmentImage : undefined },
					timestamp: starredMessageDate,
					footer: { text: edit }
				}
			}).catch(() => null); // eslint-disable-line

			starred[message.id].count = starCount;
			starred[message.id].stars.splice(starred[message.id].stars.indexOf(user.id));
		}

		settings.starred = starred;
		await settings.save();
	})
	.on('disconnect', () => { winston.warn('Disconnected!'); })
	.on('reconnect', () => { winston.warn('Reconnecting...'); })
	.on('commandRun', (cmd, promise, msg, args) => {
		winston.info(oneLine`${msg.author.username}#${msg.author.discriminator} (${msg.author.id})
			> ${msg.guild ? `${msg.guild.name} (${msg.guild.id})` : 'DM'}
			>> ${cmd.groupID}:${cmd.memberName}
			${Object.values(args)[0] !== '' ? `>>> ${Object.values(args)}` : ''}
		`);
	})
	.on('message', async (message) => {
		if (message.author.bot || message.channel.type === 'dm') return;
		const words = await redis.db.getAsync(`filter${message.guild.id}`).then(JSON.parse);
		const enabled = await redis.db.getAsync(`filterenabled${message.guild.id}`).then(JSON.parse);
		if (enabled && words) {
			if (!client.funcs.isStaff(message.member) && client.funcs.hasFilteredWord(words, client.funcs.filterWord(message.content))) {
				await message.author.send(`Your message \`${message.content}\` was deleted due to breaking the filter!`);
				await message.delete();
				return;
			}
		}

		const channelLocks = message.guild.settings.get('locks', []);
		if (channelLocks.includes(message.channel.id)) return;
		if (earnedRecently.includes(message.author.id)) return;

		const hasImageAttachment = message.attachments.some(attachment => attachment.url.match(/\.(png|jpg|jpeg|gif|webp)$/));
		const moneyEarned = hasImageAttachment ? Math.ceil(Math.random() * 7) + 5 : Math.ceil(Math.random() * 7) + 1;

		// Currency.addBalance(message.author.id, moneyEarned);
		Currency._changeBalance(message.author.id, moneyEarned);

		earnedRecently.push(message.author.id);
		setTimeout(() => {
			const index = earnedRecently.indexOf(message.author.id);
			earnedRecently.splice(index, 1);
		}, 8000);

		if (!gainedXPRecently.includes(message.author.id)) {
			const xpEarned = Math.ceil(Math.random() * 9) + 3;
			const oldLevel = await Experience.getLevel(message.author.id);
			Experience.addExperience(message.author.id, xpEarned).then(async () => {
				const newLevel = await Experience.getLevel(message.author.id);

				if (newLevel > oldLevel) {
					Currency._changeBalance(message.author.id, 100 * newLevel);
					const notifs = message.guild.settings.get('levelNotifs', false);
					if (notifs) message.reply(`Congratulations, you have leveled up to Level ${newLevel}!`);
				}
			}).catch(() => null);

			gainedXPRecently.push(message.author.id);
			setTimeout(() => {
				const index = gainedXPRecently.indexOf(message.author.id);
				gainedXPRecently.splice(index, 1);
			}, 60 * 1000);
		}
	})
	.on('commandError', (cmd, err) => {
		if (err instanceof commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => {
		winston.info(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		winston.info(oneLine`
			Prefix changed to ${prefix || 'the default'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		winston.info(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		winston.info(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	});

client.registry
	.registerGroups([
		['commands', 'Commands'],
		['info', 'Information'],
		['util', 'Utility'],
		['mod', 'Moderation'],
		['config', 'Configuration'],
		['currency', 'Currency'],
		['system', 'System'],
		['games', 'Games'],
		['item', 'Item'],
		['economy', 'Economy'],
		['social', 'Social'],
		['music', 'Music'],
		['tags', 'Tags'],
		['fun', 'Fun'],
		['misc', 'Miscellaneous'],
		['nsfw', 'NSFW'],
		['test', 'Testing']
	])
	// .registerDefaults()
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerCommandsIn(path.join(__dirname, 'commands'))
	.registerDefaultCommands({ eval_: false });

client.login(config.token);

process.on('unhandledRejection', err => {
 	console.error('Uncaught Promise Error: \n' + err.stack); // eslint-disable-line
});
