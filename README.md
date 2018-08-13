# Slick CSS :balloon:

[![CircleCI](https://circleci.com/gh/ameerthehacker/express-slick-css/tree/master.svg?style=svg)](https://circleci.com/gh/ameerthehacker/express-slick-css/tree/master)
[![codecov](https://codecov.io/gh/ameerthehacker/express-slick-css/branch/master/graph/badge.svg)](https://codecov.io/gh/ameerthehacker/express-slick-css)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

No more bloated CSS styles :poop: in your websites.

## How it works?

1. It intercepts the **res.render** method in the express framework
2. Strips out all the stylesheets from the html document
3. Extracts only used styles using [uncss]
4. Creates a new stylesheet in the path specified(cssPath) and caches it
5. Adds the newly created stylesheet to the html document
6. Send the response

## How to use it?

1. Install the package

```bash
npm install express-slick-css --save
```

2. Add all the stylesheets to the layout

```html
...
<!-- rel='stylesheet' must be there otherwise it won't be picked up -->
<link href='/stylesheets/style.css' rel='stylesheet'>
...
```

3. Add the middleware before all the routes

```javascript
const slickify = require('express-slick-csss');
...
app.use(slickify(options));
...
app.use('/', indexRoutes);
```

## Options

|   Options    |                          Description                          | Mandatory | Default Value |
| :----------: | :-----------------------------------------------------------: | :-------: | :-----------: |
|  outputPath  |            path to save the new slick stylesheets             |    Yes    |      N/A      |
|   cssPath    |      path to look for stylesheets specified in link tag       |    No     |  outputPath   |
|  publicPath  | public path for serving css asset `eg. href="/css/style.css"` |    No     |      '/'      |
| uncssOptions |         Supports all the options provided by [uncss]          |    No     | Refer [uncss] |

## Example

```javascript
app.use(
  slickify({
    cssPath: path.join(__dirname, 'css'),
    // outputPath must exists
    // Add the outputPath to .gitignore if you want
    outputPath: path.join(__dirname, 'slick-css'),
    publicPath: '/stylesheets/',
    uncssOptions: {
      // Include global CSS frameworks here to keep it clean
      stylesheets  : ['lib/bootstrap/dist/css/bootstrap.css']
    }
  });
);
```

## How to contribute?

Feel free to create an issue for a feature request, bug and you can take up any of those to make a pull request

Show your support by :star: the repo

## License

MIT © [Ameer Jhan](mailto:ameerjhanprof@gmail.com)

[uncss]: https://github.com/uncss/uncss
