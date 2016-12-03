/**
 * convert payload to a token
 *
 * @param {Object} payload
 * @return {String} a token
 */
function serializeToken(payload) {
  return JSON.stringify(payload);
}

/**
 * convert a token to payload
 *
 * @param {String} a token
 * @returns {Object} payload
 */
function unserializeToken(token) {
  return JSON.parse(token);
}

/**
 * get a random string, default charset is
 * `1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ`
 *
 * @param {Number} length
 * @param {String} charset
 * @return {String}
 */
function getRandomString(length, charset) {
  charset = charset || '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const getRandomInt = require('./index').getRandomInt;
  const charsetLength = charset.length;

  let str = '';
  while(length--) str += charset.charAt(getRandomInt(charsetLength));
  return str;
}

module.exports = {
  serializeToken: serializeToken,
  unserializeToken: unserializeToken,
  getRandomString: getRandomString
};
