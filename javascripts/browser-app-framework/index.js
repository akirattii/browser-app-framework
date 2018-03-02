/*
* Node module import file for Browser App Framework
*
* ## Usage
*
* Do browserify this file:
* ```
* $ browserify javascripts/browser-app-framework/index.js -o javascripts/browser-app-framework/bundle.js
* ```
* Or do it with uglifyjs:
* ```
* $ browserify javascripts/browser-app-framework/index.js | uglifyjs > javascripts/browser-app-framework/bundle.js
* ```
*
* Then use a generated `bundle.js` on `index.html`:
* ```
* <script src="javascripts/browser-app-framework/bundle.js"></script>
* ```
*/
/** CAUTION: DO NOT REMOVE! Below modules are required for Browser App Framework */
global.querystring = require('querystring');


/** TODO: append `require('...')` here to use your favorite npm module */
// global.QRCode = require('qrcode');
