const helpers = require('../helpers');

/**
 * create a instance of Sequelize with database config
 *
 * @param {Express} app
 * @param {Object} config
 * @returns
 */
function createSequelize(app, config) {
  const Sequelize = require('sequelize');

  helpers.mkdirsForFileSync(config.database);

  let sequelize = new Sequelize('loudly', null, '', {
    dialect: 'sqlite',
    storage: config.database,
    logging: config.databaseDebug ? console.log : false
  });

  return sequelize;
}

/**
 * link defined models to initialized sequelize instance
 *
 * @param {Sequelize} sequelize
 * @returns {Object} models
 */
function createModels(sequelize) {
  let models = {};

  models.Entity = sequelize.import('./models/entity.js');
  models.Comment = sequelize.import('./models/comment.js');

  return models;
}

module.exports = {
  createModels: createModels,
  createSequelize: createSequelize
};
