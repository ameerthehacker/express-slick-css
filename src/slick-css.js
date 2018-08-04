const Promise = require('bluebird');
const { JSDOM } = require('jsdom');
const path = require('path');

class SlickCSS {
  constructor(options) {
    this.options = options;
  }

  async slickify(htmlContent) {
    const { uncssFn, errorFn } = this.options;

    return new Promise((resolve, reject) => {
      if (uncssFn === undefined) {
        errorFn('option uncssFn not defined');
        reject();

        return;
      }
      uncssFn(htmlContent, this.options.uncssOptions, (err, slickCSS) => {
        if (!err) {
          resolve(slickCSS);
        } else {
          reject(err);
        }
      });
    });
  }

  async saveSlickCSS(htmlContent) {
    return new Promise((resolve, reject) => {
      const { fileManager, errorFn } = this.options;

      if (fileManager === undefined) {
        errorFn('option fileManager not specified');
        reject();

        return;
      }

      return this.slickify(htmlContent)
        .then((usedStyles) => {
          resolve(fileManager.write(usedStyles));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getDom(htmlContent) {
    const dom = new JSDOM(htmlContent);

    return dom;
  }

  removeStyleSheets(dom) {
    const styleSheets = dom.window.document.querySelector(
      'link[rel="stylesheet"]'
    );

    styleSheets.remove();

    return dom;
  }

  async addSlickCSS(dom, htmlContent) {
    return new Promise((resolve, reject) => {
      const { cssPath, errorFn, publicPath } = this.options;

      if (cssPath === undefined) {
        errorFn('option cssPath not specified');
        reject();

        return;
      }

      if (publicPath === undefined) {
        errorFn('option cssPath not specified');
        reject();

        return;
      }

      return this.saveSlickCSS(htmlContent)
        .then((filePath) => {
          const cssFileName = filePath.split(path.sep).pop();
          const slickStyleSheet = dom.window.document.createElement('link');

          slickStyleSheet.setAttribute('href', `${publicPath}${cssFileName}`);
          slickStyleSheet.setAttribute('rel', 'stylesheet');
          dom.window.document.head.appendChild(slickStyleSheet);

          resolve(dom);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = SlickCSS;
