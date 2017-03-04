global.Promise = require('bluebird');

const commando = require('discord.js-commando');
const Discord = require('discord.js');
const Currency = require('./currency/Currency');
const Experience = require('./currency/Experience');
const starBoard = require('./dataProviders/postgreSQL/models/StarBoard');
const { oneLine, stripIndents } = require('common-tags');
const path = require('path');
const Raven = require('raven');
const moment = require('moment');
const winston = require('./structures/Logger.js');

/*
const memwatch = require('memwatch-next');
const heapdump = require('heapdump');
const cron = require('node-schedule');
const moment = require('moment-timezone');
*/

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
	commandPrefix: ',',
	unknownCommandResponse: false,
	disableEveryone: true,
	clientOptions: { shardCount: 'auto' }
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
	const blacklist = client.provider.get('global', 'userBlacklist', []);
	if (!blacklist.includes(msg.author.id)) return false;
	return `User ${msg.author.username}#${msg.author.discriminator} (${msg.author.id}) has been blacklisted.`;
});

client
	.on('error', winston.error)
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
		/*
		// memory leag debug
	  memwatch.on('leak', function(info) {
	    console.error(info);
	    var file = './out/floofybot-' + process.pid + '-' + Date.now() + '.heapsnapshot';
	    heapdump.writeSnapshot(file, function(err){
	      if (err) console.error(err);
	      else console.error('Wrote snapshot: ' + file);
	    });
	  });
		*/
		let servers = ` in ${client.guilds.size} servers!`;
		let users = ` with ${client.users.size} users!`;
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
		if (message.author.id === user.id) return;
		let settings = await starBoard.findOne({ where: { guildID: message.guild.id } });
		if (!settings) settings = await starBoard.create({ guildID: message.guild.id });
		let starred = settings.starred;
		if (starred.hasOwnProperty(message.id)) {
			if (starred[message.id].stars.includes(user.id)) return message.reply('you cannot star the same message twice!'); // eslint-disable-line consistent-return
			const starCount = starred[message.id].count += 1;
			const starredMessage = await starboard.fetchMessage(starred[message.id].starredMessageID).catch(console.log);
			const edit = starredMessage.content.replace(`⭐ ${starCount - 1}`, `⭐ ${starCount}`);
			await starredMessage.edit(edit);
			starred[message.id].count = starCount;
			starred[message.id].stars.push(user.id);
			settings.starred = starred;
			await settings.save().catch(console.error);
		} else {
			const starCount = 1;
			let image;
			if (message.attachments.some(attachment => attachment.url.match(/\.(png|jpg|jpeg|gif|webp)$/))) image = message.attachments.first().url;
			const sentStar = await starboard.send(stripIndents`
				●▬▬▬▬▬▬▬▬▬▬▬▬▬▬●
				⭐ ${starCount}
				**Author**: \`${message.author.username} #${message.author.discriminator}\` | **Channel**: \`${message.channel.name}\` | **ID**: \`${message.id}\` | **Time**: \`${moment(new Date()).format('DD/MM/YYYY @ hh:mm:ss a')}\`
				**Message**:
				${message.cleanContent}
				`, { file: image }).catch(null);
			starred[message.id] = {};
			starred[message.id].author = message.author.id;
			starred[message.id].starredMessageID = sentStar.id;
			starred[message.id].count = starCount;
			starred[message.id].stars = [];
			starred[message.id].stars.push(user.id);
			settings.starred = starred;
			await settings.save().catch(winston.error);
		}
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

		Currency.addBalance(message.author.id, moneyEarned);

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
			}).catch(winston.error);

			gainedXPRecently.push(message.author.id);
			setTimeout(() => {
				const index = gainedXPRecently.indexOf(message.author.id);
				gainedXPRecently.splice(index, 1);
			}, 60 * 1000);
		}
	})
	.on('commandError', (cmd, err) => {
		if (err instanceof commando.FriendlyError) return;
		winston.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
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
		['nsfw', 'NSFW'],
		['test', 'Testing']
	])
	// .registerDefaults()
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerCommandsIn(path.join(__dirname, 'commands'))
	.registerDefaultCommands({ eval_: false });

client.login(config.token);
