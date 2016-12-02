const process = require('process');
const loudly = require('./core');

let app = loudly(process.env.NODE_ENV);
let server = app.listen(3000, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
