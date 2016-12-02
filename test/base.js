const supertest = require('supertest');
const createApp = require('../core');
const testEnvironment = 'test';

let app = createApp(testEnvironment);
let models = app.get('models');
let sequelize = app.get('sequelize');

/**
 * make a request with specific method
 *
 * @param {any} url
 * @param {any} method
 * @returns a Request object
 */
function request(url, method) {
  let request = supertest(app);
  method = method || 'get';

  return request[method](url);
}

/**
 * drop and create all tables
 *
 * @param {any} done
 */
function resetDatabase(done) {
  sequelize.sync({ force: true }).then((sequelize) => {
    done();
  });
}

/**
 * toggle query echo of sequelize
 */
function toggleSQLEcho() {
  if (!sequelize.options.logging) sequelize.options.logging = console.log;
  else sequelize.options.logging = null;
}

module.exports = {
  request: request,
  models: models,
  resetDatabase: resetDatabase,
  toggleSQLEcho: toggleSQLEcho
};
