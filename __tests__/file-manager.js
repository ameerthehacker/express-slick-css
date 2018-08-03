const FileManager = require('../src/file-manager');
const fs = require('fs');
const path = require('path');

describe('file-manager.js', () => {
  let fileManager, contentHash, options, fileContent;

  beforeEach(() => {
    contentHash = 'hash';
    options = {
      cssPath: 'stylesheets',
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

  it('should return true if file exists', () => {
    const fileName = path.join(options.cssPath, `${contentHash}.css`);

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

  it('should fail with error when cssPath is not given', () => {
    options.cssPath = undefined;

    expect(fileManager.exists(fileContent)).toBeUndefined();
    expect(options.errorFn).toBeCalled();
  });

  it('should fail with when hashFn is not given', () => {
    options.hashFn = undefined;

    expect(fileManager.exists(fileContent)).toBeUndefined();
    expect(options.errorFn).toBeCalled();
  });
});
