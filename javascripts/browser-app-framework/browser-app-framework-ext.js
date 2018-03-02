/**
 * Browser App Framework extension point.
 * NOTE: Typically you can write here some application specific global functions
 */
if (!app) throw Error("[BAF] 'browser-app-framework-base.js' must be loaded in advance");

// app.showQRCode = function(canvas, data, cb) {
//   // first, clear canvas:
//   canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
//   if (!canvas || !data) return;
//   // show QRcode image:
//   QRCode.toCanvas(canvas, data, function(error) {
//     return cb && cb(error);
//   });
// };