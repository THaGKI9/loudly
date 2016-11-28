const process = require('process');
const configurations = require('../config');

var configName = process.env.NODE_ENV;
var config = configurations[configName];

if (config === undefined) {
  throw new Error('cannot find configuration `' + configName +
                  '`, have you defined it `config.js`?');
}

module.exports = config;
