const fs = require('fs');
const path = require('path');

class FileManager {
  constructor(options) {
    this.options = options;
  }

  getFilePath(fileContent) {
    const { outputPath, hashAlgo, hashFn } = this.options;

    if (outputPath === undefined) {
      throw new Error('option outputPath not specified');
    }

    if (hashFn == undefined) {
      throw new Error('option hashFn not specified');
    }
    const contentHash = hashFn(fileContent, hashAlgo);

    return path.join(outputPath, `${contentHash}.css`);
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
