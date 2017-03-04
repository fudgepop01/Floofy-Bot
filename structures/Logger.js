/*
const { oneLine, stripIndents } = require('common-tags');
const moment = require('moment');
const logger = require('winston');
const chalk = require('chalk');

logger.setLevels({
	debug: 0,
	info: 1,
	silly: 2,
	warn: 3,
	error: 4
});
logger.addColors({
	debug: 'green',
	info: 'cyan',
	silly: 'magenta',
	warn: 'yellow',
	error: 'red'
});

// Define options for Date#toLocaleTimeString call we will use.
const twoDigit = '2-digit';
const options = {
	day: twoDigit,
	month: twoDigit,
	year: twoDigit,
	hour: twoDigit,
	minute: twoDigit,
	second: twoDigit
};

function formatter(args) {
	const dateTimeComponents = new Date().toLocaleTimeString('en-us', options).split(',');
	const logMessage = `${chalk.blue(dateTimeComponents[0] + dateTimeComponents[1])} - ${chalk.magenta(args.level)}: ${chalk.dim(args.message)}`;
	return logMessage;
}

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize: true, formatter: formatter });

module.exports = logger;
*/

/*
console.log(oneLine`
    ${chalk.blue(`[${moment().format('HH:mm:ss')}]`)}
    ${chalk.grey(`${message.guild ? message.guild.name : 'DM:'}:`)}
    ${chalk.cyan(`${message.channel.name ? `#${message.channel.name}` : ''} -`)}
    ${message.author.username}:
    ${chalk.grey(message.cleanContent)}`);
*/
/*
const winston = require('winston');
const	dateformat = require('dateformat');
const	chalk = require('chalk');

module.exports = new winston.Logger({
	transports: [
		new winston.transports.Console({
			timestamp: function() {
				return dateformat(Date.now(), 'yyyy-mm-dd HH:MM:ss.l');
			},
			formatter: function(options) {
				var message = '';

				if (options.message !== undefined) {
					message = options.message;
				}

				var meta = '';

				if (options.meta && Object.keys(options.meta).length) {
					meta = `\n\t${JSON.stringify(options.meta)}`;
				}

				var level = options.level.toUpperCase();

				switch (level) {
					case 'INFO':
						level = chalk.cyan(level);
						break;

					case 'WARN':
						level = chalk.yellow(level);
						break;

					case 'ERROR':
						level = chalk.red(level);
						break;

					default:
						break;
				}

				var output = [
					`[${options.timestamp()}][${level}]`,
					message,
					meta
				];

				return output.join(' ');
			}
		})
	]
});
*/
const winston = require('winston');
const moment = require('moment');
const { oneLine } = require('common-tags');

winston.setLevels({
	debug: 0,
	info: 1,
	silly: 2,
	warn: 3,
	error: 4
});
winston.addColors({
	debug: 'green',
	info: 'cyan',
	silly: 'magenta',
	warn: 'yellow',
	error: 'red'
});

function formatter(options) {
	return oneLine`
	[${winston.config.colorize(options.level, `${moment().format('HH:mm:ss')}]`)}
	[${winston.config.colorize(options.level, options.level)}] ${options.message}`;
}


module.exports = new winston.Logger({
	transports: [
		new winston.transports.Console({
			colorize: true,
			level: 'silly',
			showLevel: true,
			formatter: formatter
		})
	]
});
