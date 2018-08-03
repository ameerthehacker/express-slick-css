const crypto = require('crypto');

module.exports = {
  hash(fileContent, hashAlgo = 'sha512') {
    return crypto
      .createHash(hashAlgo)
      .update(fileContent)
      .digest('hex');
  }
};
