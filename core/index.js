function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('I AM DOWN');
}

module.exports = function createLoudly(env) {
  const express = require('express');
  const db = require('./db');

  let app = express();
  app.set('env', env || 'development');

  /* load config */
  let config = require('./config')(app);
  app.set('config', config);

  /* load Sequelize */
  let sequelize = db.createSequelize(app, config);
  app.set('sequelize', sequelize);

  /* load models */
  let models = db.createModels(sequelize);
  app.set('models', models);

  /* create tables */
  sequelize.sync();

  app.use('/', require('./routes'));
  app.use(errorHandler);

  return app;
};
