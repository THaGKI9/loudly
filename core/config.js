const extend = require('extend');
const configurations = require('../config');

function createConfiguration(app) {
  let env = app.get('env');
  let config = configurations[env];

  if (config === undefined) {
    throw new Error('cannot find configuration `' + env +
                    '`, have you defined it `config.js`?');
  }

  /* set default config */
  let defaultConfig = {
    loginTimeout: 5 * 60 * 1000,
    commentsPerPage: 20
  };

  let appConfig = extend({}, defaultConfig, config);
  return appConfig;
}

module.exports = createConfiguration;
