// Expose the middleware here
const { hash } = require('./src/hash');
const { error } = require('./src/util');
const FileManager = require('./src/file-manager');
const SlickCSS = require('./src/slick-css');
const uncss = require('uncss');

// Set the best default option for the middleware
function setDefaultOptions(options) {
  options.uncssOptions.htmlroot =
    options.uncssOptions.htmlroot || options.cssPath;
  options.publicPath = options.publicPath || '/';
  options.uncssFn = uncss;
  options.fileManager = new FileManager({
    errorFn: error,
    hashFn: hash,
    cssPath: options.cssPath
  });
  options.errorFn = error;

  return options;
}

module.exports = (options) => {
  options = setDefaultOptions(options);
  const slickCSS = new SlickCSS(options);

  return (req, res, next) => {
    const _render = res.render;

    res.render = (view, options, callback) => {
      _render.call(res, view, options, (err, htmlContent) => {
        // Keep the default behaviour
        if (callback !== undefined) {
          callback.call(err, htmlContent);
        }

        if (!err) {
          // Restructure the dom
          let dom = slickCSS.getDom(htmlContent);
          dom = slickCSS.removeStyleSheets(dom);

          // Send the slick CSS ;)
          slickCSS
            .addSlickCSS(dom, htmlContent)
            .then((dom) => {
              res.send(dom.serialize());
            })
            .catch((err) => {
              error(err);
            });
        } else {
          error(err);
        }
      });
    };

    next();
  };
};
