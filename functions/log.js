const moment = require('moment');
const chalk = require('chalk');

const clk = new chalk.constructor({ enabled: true });

module.exports = (data, type = 'log') => {
  switch (type.toLowerCase()) {
    case 'debug':
      console.log(`${clk.magenta(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`)} ${clk.cyan(data)}`);
      break;
    case 'warn':
      console.warn(`${clk.yellow(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`)} ${clk.cyan(data)}`);
      break;
    case 'error':
      console.error(`${clk.red(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`)}  ${clk.cyan(data)}`);
      break;
    case 'log':
      console.log(`${clk.blue(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`)}  ${clk.cyan(data)}`);
      break;
      // no default
  }
};

/*
console.log(oneLine`
    ${chalk.blue(`[${moment().format('HH:mm:ss')}]`)}
    ${chalk.grey(`${message.guild ? message.guild.name : 'DM:'}:`)}
    ${chalk.cyan(`${message.channel.name ? `#${message.channel.name}` : ''} -`)}
    ${message.author.username}:
    ${chalk.grey(message.cleanContent)}`);
		*/
		// http://prntscr.com/efrmhn
