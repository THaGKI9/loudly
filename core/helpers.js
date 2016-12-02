const path = require('path');
const fs = require('fs');
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

    if (fs.existsSync(dir) && !fs.statSync(dir).isDirectory()) {
      throw new Error('part of the filepath `' + dir + '` in `' + dirname +
                      '` exists and it\'s not a directory');
    }

    fs.mkdirSync(dir);
  }
}

module.exports = {
  mkdirsForFileSync: mkdirsForFileSync
};
