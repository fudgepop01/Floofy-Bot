global.Promise = require('bluebird');

const commando = require('discord.js-commando');
const Discord = require('discord.js');
const Currency = require('./currency/Currency');
const { oneLine } = require('common-tags');
const path = require('path');
const Raven = require('raven');
const winston = require('winston');
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
// const Thonk = require('./dataProviders/rethinkProvider');

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
	.on('ready', () => {
		winston.info(oneLine`
			Client ready... Logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})
		`);
		Currency.leaderboard();
		/*
		client.guildSettings = new Discord.Collection();
		client.database = new Thonk(client);
		client.database.initGuilds();
		*/
		loadFunctions(client).then(() => {
			client.methods = {};
			client.methods.Collection = Discord.Collection;
			client.methods.Embed = Discord.RichEmbed;
			// client.methods.superagent = require('superagent');
			// client.methods.request = Discord.Request;
			loadEvents(client);
		});
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
		if (message.author.bot) return;

		const { words } = message.client.provider.get(message.guild, 'filter', {});
		if (!message.client.funcs.isStaff(message.member) && message.client.funcs.hasFilteredWord(words, message.client.funcs.filterWord(message.content))) {
			await message.author.send(`Your message \`${message.content}\` was deleted due to breaking the filter!`)
			await message.delete();
			return;
		}

		if (earnedRecently.includes(message.author.id)) return;

		const hasImageAttachment = message.attachments.some(attachment => attachment.url.match(/\.(png|jpg|jpeg|gif|webp)$/));
		const moneyEarned = hasImageAttachment ? Math.ceil(Math.random() * 7) + 1 : Math.ceil(Math.random() * 7) + 5;

		Currency.addBalance(message.author.id, moneyEarned);

		earnedRecently.push(message.author.id);
		setTimeout(() => {
			const index = earnedRecently.indexOf(message.author.id);
			earnedRecently.splice(index, 1);
		}, 8000);
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
