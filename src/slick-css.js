const Promise = require('bluebird');

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
}

module.exports = SlickCSS;
