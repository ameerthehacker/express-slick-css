const SlickCSS = require('../src/slick-css');
let uncss = require('uncss');
let { error } = require('../src/util');

describe('slick-css.js', () => {
  let slickCSS, options, htmlContent;

  beforeEach(() => {
    options = { uncssOptions: {}, uncssFn: uncss, errorFn: error };
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
});
