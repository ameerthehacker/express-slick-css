const FileManager = require('../src/file-manager');
const fs = require('fs');
const path = require('path');

describe('file-manager.js', () => {
  let fileManager, contentHash, options, fileContent;

  beforeEach(() => {
    contentHash = 'hash';
    options = {
      outputPath: 'stylesheets',
      hashFn: jest.fn().mockReturnValue(contentHash),
      errorFn: jest.fn()
    };
    fileManager = new FileManager(options);
    fileContent = `
    body {
      background: white;
    }
    `;
  });

  describe('exists()', () => {
    it('should return true if file exists', () => {
      const fileName = path.join(options.outputPath, `${contentHash}.css`);

      fs.existsSync = jest.fn().mockImplementation((path) => {
        if (path === fileName) {
          return true;
        } else {
          return false;
        }
      });

      expect(fileManager.exists(fileContent)).toBeTruthy();
    });

    it('should return false with error if file does not exists', () => {
      fs.existsSync = jest.fn().mockReturnValue(false);

      expect(fileManager.exists(fileContent)).toBeFalsy();
    });
  });

  describe('getFilePath()', () => {
    it('should fail with error when outputPath is not given', () => {
      options.outputPath = undefined;

      expect(() => {
        fileManager.getFilePath(fileContent);
      }).toThrowError('option outputPath not specified');
    });

    it('should fail with error when hashFn is not given', () => {
      options.hashFn = undefined;

      expect(() => {
        fileManager.getFilePath(fileContent);
      }).toThrowError('option hashFn not specified');
    });

    it('should return the correct path', () => {
      const filePath = path.join(options.outputPath, `${contentHash}.css`);

      expect(fileManager.getFilePath(fileContent)).toBe(filePath);
    });
  });

  describe('write()', () => {
    beforeEach(() => {
      fs.writeFileSync = jest.fn();
    });

    it('should call getFilePath() with fileContent', () => {
      fileManager.getFilePath = jest.fn();

      fileManager.write(fileContent);

      expect(fileManager.getFilePath).toBeCalledWith(fileContent);
    });

    it('should call exists() with fileContent', () => {
      fileManager.exists = jest.fn();

      fileManager.write(fileContent);

      expect(fileManager.exists).toBeCalledWith(fileContent);
    });

    it('should not call fs.fileWriteSync() when file exists', () => {
      fileManager.exists = jest.fn().mockReturnValue(true);

      fileManager.write(fileContent);

      expect(fs.writeFileSync).not.toBeCalled();
    });

    it('should call fs.fileWriteSync() when file does not exists', () => {
      fileManager.exists = jest.fn().mockReturnValue(false);

      fileManager.write(fileContent);

      expect(fs.writeFileSync).toBeCalled();
    });
  });
});
