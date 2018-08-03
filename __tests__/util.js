/*eslint no-console: 0*/
const { warnPrefix, errorPrefix, warn, error } = require('../src/util');

describe('util.js', () => {
  let message;

  beforeEach(() => {
    message = 'some message';
    console.log = jest.fn();
  });

  it('should print the warning properly', () => {
    warn(message);

    expect(console.log).toBeCalledWith(`${warnPrefix}: ${message}`);
  });

  it('should print the error properly', () => {
    error(message);

    expect(console.log).toBeCalledWith(`${errorPrefix}: ${message}`);
  });
});
