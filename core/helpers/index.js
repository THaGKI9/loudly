const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const promise = require('bluebird');


/**
 * recursively create directory for a file under parent directory
 *
 * @example
 * mkdirsForFile('content/tmp/hello');
 * // this statement will create folder `content` first, and `content/tmp`
 *
 * @param {String} filepath
 * @return {Promise}
 */
function mkdirsForFileSync(filepath) {
  if (typeof filepath !== 'string') {
    throw new TypeError('filepath is expected to be a string, ' +
                        'but not a ' + typeof filepath);
  }

  filepath = filepath.replace('\\', path.sep).replace('/', path.sep);
  filepath = path.normalize(filepath);

  let dirname = path.dirname(filepath);
  let dirs = dirname.split(path.sep);

  /* create directory from parents to childrens */
  for (let i = 1; i <= dirs.length; i += 1) {
    let dir = path.join.apply(path, dirs.slice(0, i));

    if (fs.existsSync(dir)) {
      if (!fs.statSync(dir).isDirectory()) {
        throw new Error('part of the filepath `' + dir + '` in `' + dirname +
                        '` exists and it\'s not a directory');
      }
      else {
        continue;
      }
    }

    fs.mkdirSync(dir);
  }
}

/**
 * generate a random number between max and min
 *
 * @param {Number} max
 * @param {Number} min, default to 0
 * @return {Number}
 */
function getRandomInt(max, min) {
  min = min || 0;
  return Math.floor((Math.random() * (max - min)) + min);
}

/**
 * return a lower-case string of sha1 hash to argArray
 *
 * @param {String[]} argArray
 * @return {String} sha1 hash in lower-case
 */
function sha1(argArray) {
  let sha1 = crypto.createHash('sha1');
  argArray.forEach((string, index, array) => sha1.update(string));
  return sha1.digest('hex');
}

/**
 * check if NODE_ENV contain `test`
 *
 * @param {expressApp}
 * @return {Boolean}
 */
function isTestEnvironment(expressApp) {
  let env = expressApp.get('env') + '';
  return /test/.test(env);
}

module.exports = {
  mkdirsForFileSync: mkdirsForFileSync,
  getRandomInt: getRandomInt,
  sha1: sha1,
  isTestEnvironment: isTestEnvironment
};
