const fs = require('fs');
const path = require('path');

class FileManager {
  constructor(options) {
    this.options = options;
  }

  exists(fileContent) {
    const { cssPath, hashAlgo, hashFn, errorFn } = this.options;

    if (cssPath === undefined) {
      errorFn('option cssPath not specified');

      return;
    }

    if (hashFn == undefined) {
      errorFn('option hashFn not defined');

      return;
    }

    const contentHash = hashFn(fileContent, hashAlgo);

    return fs.existsSync(path.join(cssPath, `${contentHash}.css`));
  }
}

module.exports = FileManager;
