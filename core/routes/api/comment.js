/**
 * This file contains RESTful interface definations
 * and exposes an Express Router instance
 *
 * Every request should contain `unique id` in your query string,
 * which is an identify of your entity.
 */

const express = require('express');
const bodyParser = require('body-parser');
const utils = require('./utils');
const router = express.Router();

/**
 * Extract unique id from request and put into `Response.locals`.
 *
 * response:
 * - 400 Bad Request: missing unique id
 * */
router
.use(bodyParser.json())
.use(function getUniqueIdMiddleware(res, rep, next) {
  var uid = res.query.uniqueId;

  // missing unique id
  if (!uid) return res.status(400).json({
    msg: 'missing unique id'
  });

  rep.locals.uid = uid;
  next();
});

/**
 * Retrieve a list of comments.
 *
 * method: GET
 * params:
 * - uniqueId
 * - limit: comment limit per page
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
 *         "commentId": 0,
 *         "content": "this is a comment",
 *         "iconId": 0,
 *         "nickname": "admin"
 *         "createTime": 1480351030 // seconds since UTC
 *       }]
 *     }
 *   }
 */
router.get('/comment/', (res, rep, err) => {

  res.status(200).json();
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
 *
 * examples:
 * - status code: 201 Created
 *   {
 *     "data": {
 *       "uniqueId": 0,
 *       "comment": {
 *         "commentId": 0,
 *         "content": "this is a comment",
 *         "iconId": 0,
 *         "nickname": "admin"
 *         "createTime": 1480351030 // seconds since UTC
 *       }
 *     }
 *   }
 *
 * - status code: 400 Bad Request
 *   { "msg": "missing comment content" }
 */
router.post('/comment/', (res, rep, err) => {

  res.status(201).json({});
});

/**
 * Delete a comment. NEED AUTHENTICATION.
 *
 * method: delete
 *
 * params:
 * - uniqueId
 * - commentId
 *
 * response:
 * - 204 No Content: success
 * - 404 Not Found: comment doesn't exist
 *
 * example:
 * - 204 No Content
 *   {}
 *
 * - 404 Not Found
 *   { "msg": "this comment doesn't exist" }
 */
router.delete('/comment/', utils.authenticationHandler, (res, rep, err) => {

  res.status(204).json({});
});