let uncss = require('uncss');
let { error } = require('../src/util');
let { JSDOM } = require('jsdom');
const SlickCSS = require('../src/slick-css');
const path = require('path');

jest.mock('jsdom');

describe('slick-css.js', () => {
  let slickCSS, options, htmlContent;

  beforeEach(() => {
    options = {
      uncssOptions: {},
      uncssFn: uncss,
      errorFn: error,
      cssPath: 'css',
      publicPath: '/'
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
      slickCSS.options.errorFn = errorMock = jest.fn();
      expect.assertions(1);

      return slickCSS.slickify(htmlContent).catch(() => {
        expect(errorMock).toBeCalled();
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
      dom = {};
      slickCSS.saveSlickCSS = jest.fn();
    });

    it('should reject with error when cssPath is not given', () => {
      slickCSS.options.errorFn = jest.fn();
      slickCSS.options.cssPath = undefined;
      expect.assertions(1);

      return slickCSS.addSlickCSS(dom, htmlContent).catch(() => {
        expect(slickCSS.options.errorFn).toBeCalled();
      });
    });

    it('should reject with error when publicPath is not given', () => {
      slickCSS.options.errorFn = jest.fn();
      slickCSS.options.publicPath = undefined;
      expect.assertions(1);

      return slickCSS.addSlickCSS(dom, htmlContent).catch(() => {
        expect(slickCSS.options.errorFn).toBeCalled();
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
});
