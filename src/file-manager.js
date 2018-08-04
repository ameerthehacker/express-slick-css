const fs = require('fs');
const path = require('path');

class FileManager {
  constructor(options) {
    this.options = options;
  }

  getFilePath(fileContent) {
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

    return path.join(cssPath, `${contentHash}.css`);
  }

  exists(fileContent) {
    return fs.existsSync(this.getFilePath(fileContent));
  }

  write(fileContent) {
    const filePath = this.getFilePath(fileContent);

    if (!this.exists(fileContent)) {
      fs.writeFileSync(filePath, fileContent, { flag: 'wx' });
    }

    return filePath;
  }
}

module.exports = FileManager;
