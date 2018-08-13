const chalk = require('chalk').default;

/*eslint no-console: 0*/
const warnPrefix = 'warn';
const errorPrefix = 'error';

module.exports = {
  warnPrefix,
  errorPrefix,
  error(message) {
    console.log(chalk.red(`${errorPrefix}: ${message}`));
  },
  warn(message) {
    console.log(chalk.orange(`${warnPrefix}: ${message}`));
  }
};
