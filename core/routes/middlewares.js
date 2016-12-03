const helpers = require('../helpers');
const securityHelpers = require('../helpers/security');

/**
 * check if current session is authenticated
 *
 * response:
 * - 403: unauthentication access
 *   {
 *     "code": 403,
 *     "msg": "authentication needed"
 *   }
 */
function needAuth(req, res, next) {
  let token;

  try {
    token = securityHelpers.unserializeToken(req.session.token);
  } catch (SyntaxError) {
    token = {};
  }

  /* validate token */
  const app = req.app;
  const appConfig = app.get('config');
  const adminConfig = appConfig.admin;

  let disableAuth = (helpers.isTestEnvironment(app) &&
                     appConfig.disableAuth === true);

  if (disableAuth ||
      (token.username === adminConfig.user &&
       token.password === adminConfig.password)) {
    // TODO: log something
    next();
  }
  else {
    res.status(403).json({
      code: 403,
      msg: 'authentication needed'
    });
  }

}

module.exports = {
  needAuth: needAuth
};
