/**
 * This file contains RESTful interface definations
 * and exposes an Express Router instance
 *
 * Every request should contain `unique id` in your query string,
 * which is an identify of your entity.
 */

const express = require('express');
const bodyParser = require('body-parser');
const middlewares = require('../middlewares');

let router = express.Router();

/**
 * Extract unique id from request and put into `Response.locals`.
 *
 * response:
 * - 400 Bad Request: missing unique id
 * */
router
.use(bodyParser.json())
.use(function getUniqueIdMiddleware(req, res, next) {
  let uid = req.query.uniqueId;

  // missing unique id
  if (!uid) return res.status(400).json({
    code: 400,
    msg: 'missing unique id'
  });

  res.locals.uid = uid;
  next();
});

/**
 * Retrieve a list of comments.
 *
 * method: GET
 * params:
 * - uniqueId
 * - limit: comment limit per page, default 20
 * - page: page number, start from 0
 *
 * response:
 * - 200 OK: success
 *
 * examples:
 * - status code: 200 OK
 *   {
 *     "data": {
 *       "uniqueId": 0,
 *       "comments": [{
 *         "id": 0,
 *         "content": "this is a comment",
 *         "iconId": 0,
 *         "nickname": "admin"
 *         "createdAt": 1480351030 // seconds since UTC
 *       }]
 *     }
 *   }
 */
router.get('/comment/', (req, res, err) => {
  const Comment = res.app.get('models').Comment;
  const COMMENTS_PER_PAGE = req.app.get('config').comments_per_page;

  let uniqueId = res.locals.uid;
  let page = parseInt(req.query.page) || 0;
  let limit = parseInt(req.query.limit) || COMMENTS_PER_PAGE;

  Comment.findAll({
    where: { uniqueId: uniqueId },
    limit: limit,
    page: page
  })
  .then((comments) => {
    res
    .status(200)
    .json({
      code: 200,
      data: {
        uniqueId: uniqueId,
        comments: comments
      }
    });
  })
  .catch(err);
});


/**
 * Post a new comment.
 *
 * method: POST
 * params:
 * - uniqueId
 *
 * json:
 * - content: comment content
 * - nickname: nickname of the user. null means anonymous
 * - iconId: icon id from preset icon list
 *
 * response:
 * - 201 Created: success
 * - 400 Bad Request: content is empty of full of spaces
 * - 403 Forbidden: this comment can not be commented
 *
 * examples:
 * - status code: 201 Created
 *   {
 *     "data": {
 *       "uniqueId": 0,
 *       "comment": {
 *         "id": 0,
 *         "content": "this is a comment",
 *         "iconId": 0,
 *         "nickname": "admin"
 *         "createdAt": 1480351030 // seconds since UTC
 *       }
 *     }
 *   }
 *
 * - status code: 400 Bad Request
 *   { "msg": "content is empty of full of spaces" }
 *
 * - status code: 403 Forbidden
 *   { "msg": "this entity is not allowed to be commented" }
 */
router.post('/comment/', (req, res, err) => {
  const models = res.app.get('models');

  let uniqueId = res.locals.uid;
  let content = (req.body.content || '').trim();
  let nickname = req.body.nickname || '';
  let iconId = parseInt(req.body.iconId) || 0;
  if (content === '') {
    return res.status(400).json({
      code: 400,
      msg: 'content is empty of full of spaces'
    });
  }

  models.Entity.canComment(uniqueId)
  .then((canComment) => {
    if (!canComment) {
      res.status(403).json({
        code: 403,
        msg: 'this entity is not allowed to be commented'
      });

      return 403;
    }

    return models.Comment.create({
      uniqueId: uniqueId,
      content: content,
      iconId: iconId,
      nickname: nickname
    });

  })
  .then((comment) => {
    if (comment === 403) return;

    return res.status(201).json({
      code: 201,
      data: {
        uniqueId: uniqueId,
        comment: comment
      }
    });
  })
  .catch(err);
});

/**
 * Delete a comment. NEED AUTHENTICATION.
 *
 * method: delete
 *
 * params:
 * - uniqueId
 * - id
 *
 * response:
 * - 204 No Content: success
 * - 404 Not Found: this comment doesn't exist
 *
 * example:
 * - 204 No Content
 *   {}
 *
 * - 404 Not Found
 *   { "msg": "this comment doesn't exist" }
 */
router.delete('/comment/', middlewares.needAuth, (req, res, err) => {
  const models = res.app.get('models');

  let uniqueId = res.locals.uid;
  let id = req.query.id;

  models.Comment.findOne({
    where: { uniqueId: uniqueId, id: id }
  })
  .then((comment) => {
    if (!comment) {
      res.status(404).json({
        code: 404,
        msg: 'this comment doesn\'t exist.'
      });

      return 404;
    }

    return comment.destroy();
  })
  .then((status) => {
    if (status === 404) return;

    res.status(204).send();
  });

});

module.exports = router;
