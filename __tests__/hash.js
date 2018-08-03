const crypto = require('crypto');
const { hash } = require('../src/hash');

describe('hash.js', () => {
  let content;

  beforeEach(() => {
    content = 'Some content!';
  });

  it('should generate hash properly', () => {
    let hashAlgo = 'md5';
    let expectedHash = crypto
      .createHash(hashAlgo)
      .update(content)
      .digest('hex');

    let contentHash = hash(content, hashAlgo);

    expect(contentHash).toBe(expectedHash);
  });

  it('should generate the sha512 hash by default', () => {
    let hashAlgo = 'sha512';
    let expectedHash = crypto
      .createHash(hashAlgo)
      .update(content)
      .digest('hex');

    let contentHash = hash(content);

    expect(contentHash).toBe(expectedHash);
  });
});
