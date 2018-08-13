/*eslint no-console: 0*/
const chalk = require('chalk').default;
const { warnPrefix, errorPrefix, warn, error } = require('../src/util');

describe('util.js', () => {
  let message;

  beforeEach(() => {
    message = 'some message';
    console.log = jest.fn();
    chalk.red = jest.fn();
    chalk.orange = jest.fn();
  });

  it('should print the warning properly', () => {
    warn(message);

    expect(console.log).toBeCalledWith(
      chalk.orange(`${warnPrefix}: ${message}`)
    );
  });

  it('should print the error properly', () => {
    error(message);

    expect(console.log).toBeCalledWith(chalk.red(`${errorPrefix}: ${message}`));
  });
});
