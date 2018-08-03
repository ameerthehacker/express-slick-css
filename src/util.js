/*eslint no-console: 0*/
const warnPrefix = 'warn';
const errorPrefix = 'error';

module.exports = {
  warnPrefix,
  errorPrefix,
  warn(message) {
    console.log(`${warnPrefix}: ${message}`);
  },
  error(message) {
    console.log(`${errorPrefix}: ${message}`);
  }
};
