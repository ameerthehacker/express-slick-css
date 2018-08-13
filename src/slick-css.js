const Promise = require('bluebird');
const { JSDOM } = require('jsdom');
const path = require('path');

class SlickCSS {
  constructor(options) {
    this.options = options;
  }

  async slickify(htmlContent) {
    const { uncssFn } = this.options;

    return new Promise((resolve, reject) => {
      if (uncssFn === undefined) {
        reject('option uncssFn not specified');

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
      const { fileManager } = this.options;

      if (fileManager === undefined) {
        reject('option fileManager not specified');

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
      let { outputPath, publicPath } = this.options;

      if (outputPath === undefined) {
        reject('option outputPath not specified');

        return;
      }

      if (publicPath === undefined) {
        reject('option publicPath not specified');

        return;
      }

      return this.saveSlickCSS(htmlContent)
        .then((filePath) => {
          const cssFileName = filePath.split(path.sep).pop();
          const slickStyleSheet = dom.window.document.createElement('link');

          if (!publicPath.endsWith('/')) {
            publicPath += '/';
          }

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
