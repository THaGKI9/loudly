const base = require('./base');
const should = require('should');
const promise = require('bluebird');
const extend = require('extend');

let testComment = {
  content: 'test content',
  iconId: 0,
  nickname: 'testuser'
};

let testEntity = 'testpost';
let urlBase = '/api/comment/';
let urlPrefix = urlBase + '?uniqueId=' + testEntity;

function validateComment(comment) {
  comment.should.be.an.Object();
  comment.should.have.properties([
    'id', 'content', 'iconId', 'nickname', 'createdAt'
  ]);
  comment.id.should.be.a.Number();
  comment.content.should.be.a.String();
  comment.iconId.should.be.a.Number();
  comment.nickname.should.be.a.String();

  var timestamp = Date.parse(comment.createdAt);
  timestamp.should.not.be.a.NaN();
}

describe('./core/routes/api/comment.js', () => {

  describe('#getComments', () => {

    let amountOfComments = 50;
    let method = 'get';

    before(base.resetDatabase);
    before((done) => {
      let _testComment = extend({}, testComment);
      _testComment.uniqueId = testEntity;

      let comments = [];
      for (let i = 0; i < amountOfComments; i += 1) {
        comments.push(_testComment);
      }

      base.models.Comment.bulkCreate(comments).finally(done);
    });

    it('should success', (done) => {
      base.request(urlPrefix, method)
      .expect((res) => {
        res.body.should.have.properties(['code', 'data']);
        res.body.should.containEql({ code: 200 });
        res.status.should.equal(200);

        let data = res.body.data;
        data.should.be.an.Object();
        data.should.have.property('comments');

        let comments = data.comments;
        comments.should.be.an.Array();
        comments.length.should.equal(20);
        comments.map((comment) => {
          validateComment(comment);

          comment.content.should.equal(testComment.content);
          comment.iconId.should.equal(testComment.iconId);
          comment.nickname.should.equal(testComment.nickname);
        });
      })
      .end(done);
    });

    it('should success with limit control', (done) => {
      let limit = amountOfComments / 2;

      base.request(urlPrefix, method)
      .query({ limit: limit })
      .expect((res) => {
        res.body.should.have.properties(['code', 'data']);
        res.body.should.containEql({ code: 200 });
        res.status.should.equal(200);

        let data = res.body.data;
        data.should.be.an.Object();
        data.should.have.property('comments');

        let comments = data.comments;
        comments.should.be.an.Array();
        comments.length.should.equal(limit);
        comments.map((comment) => {
          validateComment(comment);

          comment.content.should.equal(testComment.content);
          comment.iconId.should.equal(testComment.iconId);
          comment.nickname.should.equal(testComment.nickname);
        });
      })
      .end(done);
    });

    it('should success getting nothing', (done) => {
      base.request(urlBase + '?uniqueId=fakeId', method)
      .expect((res) => {
        res.body.should.have.properties(['code', 'data']);
        res.body.should.containEql({ code: 200 });
        res.status.should.equal(200);

        let data = res.body.data;
        data.should.be.an.Object();
        data.should.have.property('comments');

        let comments = data.comments;
        comments.should.be.an.Array();
        comments.length.should.equal(0);
      })
      .end(done);
    });

  });

  describe('#postNewComment', () => {

    let method = 'post';

    before(base.resetDatabase);

    it('should success', (done) => {
      base.request(urlPrefix, method)
      .send(testComment)
      .expect((res) => {
          res.body.should.have.properties(['code', 'data']);
          res.body.should.containEql({ code: 201 });
          res.status.should.equal(201);

          let data = res.body.data;
          data.should.be.an.Object();
          data.should.have.property('comment');

          let comment = data.comment;
          validateComment(comment);

          comment.content.should.equal(testComment.content);
          comment.iconId.should.equal(testComment.iconId);
          comment.nickname.should.equal(testComment.nickname);
      })
      .end(done);
    });

    it('should failed due to empty content', (done) => {
      let _testComment = extend({}, testComment);
      _testComment.content = null;

      base.request(urlPrefix, method)
      .send(_testComment)
      .expect((res) => {
        res.body.should.have.properties(['code', 'msg']);
        res.body.should.containEql({ code: 400 });
        res.status.should.equal(400);

        let msg = res.body.msg;
        msg.should.be.a.String();
        msg.should.equal('content is empty of full of spaces');
      })
      .end(done);
    });

    it('should failed due to ban to commenting', (done) => {
      let bannedPostId = 'testpost_banned';
      let urlPrefix = '/api/comment/?uniqueId=' + bannedPostId;

      base.models.Entity.create({
        id: bannedPostId,
        ban: true
      })
      .then((entity) => {
        base.request(urlPrefix, 'post')
        .send(testComment)
        .expect((res) => {
          res.body.should.have.properties(['code', 'msg']);
          res.body.should.containEql({ code: 403 });
          res.status.should.equal(403);

          let msg = res.body.msg;
          msg.should.be.a.String();
          msg.should.equal('this entity is not allowed to be commented');
        })
        .end(done);
      });

    });

  });

  describe('#deleteComment', () => {

    beforeEach(base.resetDatabase);
    before(() => { base.appConfig.disableAuth = true; });
    after(() => { base.appConfig.disableAuth = false; });

    /**
     * insert and resolve the comment id with promise
     *
     * @param {Promise} a bluebird promise
     */
    function insertComment(uniqueId) {
      let _testComment = extend({}, testComment);
      _testComment.uniqueId = uniqueId;

      return base.models.Comment.create(_testComment)
      .then((comment) => {
        return promise.resolve(comment.id);
      });
    }

    it('should success', (done) => {
      let uniqueId = 'testpost_delete';

      insertComment(uniqueId)
      .then((id) => {
        base
        .request(urlBase + '?uniqueId=' + uniqueId + '&id=' + id, 'delete')
        .expect(204)
        .end(done);
      });
    });

    it('should failed due to non existence', (done) => {
      let uniqueId = 'testpost_delete';

      insertComment(uniqueId)
      .then((id) => {
        let fakeId = id + 10080;

        base
        .request(urlBase + '?uniqueId=' + uniqueId + '&id=' + fakeId, 'delete')
        .expect((res) => {
          res.body.should.have.property('code');
          res.body.should.containEql({ code: 404 });
          res.status.should.equal(404);

          let msg = res.body.msg;
          msg.should.be.a.String();
          msg.should.equal('this comment doesn\'t exist.');
        })
        .end(done);
      });
    });

    /* I didn't test authentication middleware because
       middlewares will be test in a single test spec. */

  });

});
