function needAuth(req, res, next) {
  // TODO: add authentication validator

  next();
}

module.exports.needAuth = needAuth;
