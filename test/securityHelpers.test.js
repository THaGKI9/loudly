const should = require('should');
const securityHelper = require('../core/helpers/security.js');

describe('./core/helpers/security.js', () => {
  const getRandomString = securityHelper.getRandomString;

  describe('#getRandomString', () => {

    it('get 10-length string', () => {
      let strs = [];
      let amountToGenerate = 10;
      while (amountToGenerate--) {
        let str = getRandomString(10);

        str.should.be.a.String();
        str.length.should.equal(10);

        if (strs.length) {
          str.should.not.equal(strs.pop());
        }
        strs.push(str);

      }
    });

    it('get 10-length string with pure number character', () => {
      let strs = [];
      let amountToGenerate = 10;

      while (amountToGenerate--) {
        let str = getRandomString(10, '0123456789');

        str.should.be.a.String();
        str.should.match(/^\d{10}$/);

        if (strs.length) {
          str.should.not.equal(strs.pop());
        }
        strs.push(str);

      }
    });


  });

})