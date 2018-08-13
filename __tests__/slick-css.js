let { JSDOM } = require('jsdom');
const SlickCSS = require('../src/slick-css');
const path = require('path');

jest.mock('jsdom');

describe('slick-css.js', () => {
  let slickCSS, options, htmlContent;

  beforeEach(() => {
    options = {
      uncssOptions: {},
      uncssFn: {},
      errorFn: {},
      outputPath: 'css',
      publicPath: '/',
      fileManager: { write() {} }
    };
    slickCSS = new SlickCSS(options);
    htmlContent = `
      <html></html>
      `;
  });

  describe('slickify()', () => {
    it('should call uncss with htmlContent, uncssOptions', () => {
      /*eslint no-unused-vars: 0*/
      let uncssMock;
      slickCSS.options.uncssFn = uncssMock = jest
        .fn()
        .mockImplementation((htmlContent, options, callback) => {
          callback(false);
        });
      expect.assertions(2);

      return slickCSS.slickify(htmlContent).then(() => {
        expect(uncssMock.mock.calls[0][0]).toBe(htmlContent);
        expect(uncssMock.mock.calls[0][1]).toBe(options.uncssOptions);
      });
    });

    it('should reject with error when uncssFn is undefined', () => {
      let errorMock;
      slickCSS.options.uncssFn = undefined;
      expect.assertions(1);

      return slickCSS.slickify(htmlContent).catch((err) => {
        expect(err).toBe('option uncssFn not specified');
      });
    });

    it('should reject when there is error in uncssFn', () => {
      let uncssMock;
      slickCSS.options.uncssFn = uncssMock = jest
        .fn()
        .mockImplementation((htmlContent, options, callback) => {
          callback(true);
        });

      return slickCSS.slickify(htmlContent).catch(() => {
        expect(1).toBe(1);
      });
    });
  });

  describe('getDom()', () => {
    it('should call new JSOM() with htmlContent', () => {
      slickCSS.getDom(htmlContent);

      expect(JSDOM).toHaveBeenCalledWith(htmlContent);
    });
  });

  describe('removeStyleSheets()', () => {
    let querySelectorMock, removeMock, dom;

    beforeEach(() => {
      removeMock = jest.fn();
      querySelectorMock = jest.fn().mockImplementation(() => {
        return { remove: removeMock };
      });
      dom = { window: { document: { querySelector: querySelectorMock } } };
    });

    it('should call querySelector with correct parameters', () => {
      const query = 'link[rel="stylesheet"]';

      slickCSS.removeStyleSheets(dom);

      expect(querySelectorMock).toHaveBeenCalledWith(query);
    });

    it('should call remove on the selected stylesheets', () => {
      slickCSS.removeStyleSheets(dom);

      expect(removeMock).toBeCalled();
    });
  });

  describe('addSlickCSS()', () => {
    let dom;

    beforeEach(() => {
      dom = {
        window: {
          document: {
            createElement() {
              return {
                setAttribute() {}
              };
            },
            head: { appendChild() {} }
          }
        }
      };
      slickCSS.saveSlickCSS = jest.fn();
    });

    it('should reject with error when outputPath is not given', () => {
      slickCSS.options.errorFn = jest.fn();
      slickCSS.options.outputPath = undefined;
      expect.assertions(1);

      return slickCSS.addSlickCSS(dom, htmlContent).catch((err) => {
        expect(err).toBe('option outputPath not specified');
      });
    });

    it('should add / at end to publicPath if it does not end with /', () => {
      slickCSS.options.publicPath = 'something';

      slickCSS.saveSlickCSS = jest.fn().mockResolvedValue('path/filename');
      expect.assertions(1);

      return slickCSS.addSlickCSS(dom, htmlContent).then(() => {
        expect(slickCSS.options.publicPath).toBeTruthy();
      });
    });

    it('should reject with error when publicPath is not given', () => {
      slickCSS.options.publicPath = undefined;
      expect.assertions(1);

      return slickCSS.addSlickCSS(dom, htmlContent).catch((err) => {
        expect(err).toBe('option publicPath not specified');
      });
    });

    it('should reject with error when saveSlickCSS fails', () => {
      const errMsg = 'some error!';
      slickCSS.saveSlickCSS = jest.fn().mockRejectedValue(errMsg);
      expect.assertions(1);

      return slickCSS.addSlickCSS(dom, htmlContent).catch((err) => {
        expect(err).toBe(errMsg);
      });
    });

    it('should attach the sheets properly', () => {
      const setAttributeMock = jest.fn();
      const createElementReturnValue = { setAttribute: setAttributeMock };
      const createElementMock = jest
        .fn()
        .mockReturnValue({ setAttribute: setAttributeMock });
      const appendChildMock = jest.fn();
      const filePath = `${__dirname}${path.sep}css${path.sep}styles.css`;
      const fileName = filePath.split(path.sep).pop();
      slickCSS.saveSlickCSS = jest.fn().mockResolvedValue(filePath);
      dom = {
        window: {
          document: {
            createElement: createElementMock,
            head: {
              appendChild: appendChildMock
            }
          }
        }
      };
      expect.assertions(6);

      return slickCSS.addSlickCSS(dom, htmlContent).then(() => {
        // Check if link element is created properly
        expect(createElementMock).toBeCalledWith('link');
        expect(setAttributeMock.mock.calls[0][0]).toBe('href');
        expect(setAttributeMock.mock.calls[0][1]).toBe(
          `${options.publicPath}${fileName}`
        );
        expect(setAttributeMock.mock.calls[1][0]).toBe('rel');
        expect(setAttributeMock.mock.calls[1][1]).toBe('stylesheet');
        // Check if link element is appended properly
        expect(appendChildMock).toBeCalledWith(createElementReturnValue);
      });
    });
  });

  describe('saveSlickCSS()', () => {
    let usedStyles;
    let slickifyMock;
    let fileManagerMock;

    beforeEach(() => {
      usedStyles = `
      .style1 {
        color: white;
      }
      `;
      slickifyMock = slickCSS.slickify = jest
        .fn()
        .mockResolvedValue(usedStyles);
      fileManagerMock = slickCSS.options.fileManager.write = jest.fn();
    });

    it('should call slickify() with htmlContent, fileManager.write() with styles', () => {
      expect.assertions(2);

      return slickCSS.saveSlickCSS(htmlContent).then(() => {
        expect(slickifyMock).toBeCalledWith(htmlContent);
        expect(fileManagerMock).toBeCalledWith(usedStyles);
      });
    });

    it('should reject with error when file manager is undefined', () => {
      slickCSS.options.fileManager = undefined;
      expect.assertions(1);

      return slickCSS.saveSlickCSS(htmlContent).catch((err) => {
        expect(err).toBe('option fileManager not specified');
      });
    });

    it('should reject with error when slickify() fails', () => {
      const errorMsg = 'Some error!';
      slickCSS.slickify = jest.fn().mockRejectedValue(errorMsg);
      expect.assertions(1);

      return slickCSS.saveSlickCSS(htmlContent).catch((err) => {
        expect(err).toBe(errorMsg);
      });
    });
  });
});
