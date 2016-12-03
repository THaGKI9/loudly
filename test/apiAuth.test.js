const base = require('./base');
const should = require('should');
const helpers = require('../core/helpers');


describe('./core/routes/api/auth.js', () => {

  describe('#login', () => {

    let url = '/api/auth/login';
    let method = 'post';

    it('should success', (done) => {
      let timestamp = new Date().getTime();
      let password = helpers.sha1([
        base.appConfig.admin.user,
        base.appConfig.admin.password,
        timestamp + ''
      ]);

      base.request(url, method)
      .send({
        username: base.appConfig.admin.user,
        password: password,
        timestamp: timestamp
      })
      .expect((res) => {
        res.body.should.have.property('code');
        res.body.should.containEql({ code: 200 });
        res.status.should.equal(200);
      })
      .end(done);
    });

    it('should failed due to unmatch id', (done) => {
      base.request(url, method)
      .send({
        username: base.appConfig.admin.user + 'test',
        password: base.appConfig.admin.password,
        timestamp: new Date().getTime()
      })
      .expect((res) => {
        res.body.should.have.properties(['code', 'msg']);
        res.body.should.containEql({
          code: 403,
          msg: 'username and password don\'t match'
        });
        res.status.should.equal(403);
      })
      .end(done);
    });

    it('should failed due to timeout', (done) => {
      let timestamp = new Date().getTime() + 6 * 60 * 1000;
      let password = helpers.sha1([
        base.appConfig.admin.user,
        base.appConfig.admin.password,
        timestamp + ''
      ]);

      base.request(url, method)
      .send({
        username: base.appConfig.admin.user,
        password: password,
        timestamp: timestamp
      })
      .expect((res) => {
        res.body.should.have.properties(['code', 'msg']);
        res.body.should.containEql({ code: 403, msg: 'login timeout' });
        res.status.should.equal(403);
      })
      .end(done);
    });

  });

});
