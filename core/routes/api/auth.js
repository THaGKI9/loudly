const express = require('express');
const helpers = require('../../helpers');
const securityHelpers = require('../../helpers/security');

let router = express.Router();

/**
 * login to get a token, which would be useful on some sentitve
 * operations such as delete comments.
 * the different between client's timestamp and server's timestamp
 * cannot larger than 5 minutes(5 * 60s * 1000 = 300000s)
 *
 * method: POST
 * json:
 * - username
 * - password: sha1(username + plain_password + timestamp)
 * - timestamp: milliseconds since UTC
 *
 * response:
 * - 200 OK: success
 *   {
 *     "code": 200,
 *     "data": {
 *       "token": "xxx"
 *     }
 *   }
 *
 * - 403 Forbidden: username and password don't match
 *   { "code": 403, "msg": "username and password don't match" }
 *
 * - 403 Forbidden: login timeout
 *   { "code": 403, "msg": "login timeout" }
 */
router.post('/auth/login', (req, res, err) => {
  const appConfig = req.app.get('config');
  const adminConfig = appConfig.admin;
  const loginTimeout = appConfig.loginTimeout;

  let username = req.body.username + '';
  let password = req.body.password + '';
  let timestamp = parseInt(req.body.timestamp);

  let clientSHA1 = password;
  let serverSHA1 = helpers.sha1([
    adminConfig.user, adminConfig.password, timestamp + '']
  );

  if (serverSHA1 !== clientSHA1) {
    res.status(403).json({
      code: 403,
      msg: 'username and password don\'t match'
    });
  } else if (isNaN(timestamp) ||
             Math.abs(timestamp - (new Date()).getTime()) > loginTimeout) {
    res.status(403).json({
      code: 403,
      msg: 'login timeout'
    });
  } else {
    req.session.token = securityHelpers.serializeToken({
      username: adminConfig.username,
      password: adminConfig.password
    });
    res.status(200).json({
      code: 200
    });
  }
});

module.exports = router;
