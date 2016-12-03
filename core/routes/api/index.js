/**
 * This file contains RESTful interface definations
 * and exposes an Express Router instance.
 */

const express = require('express');
const bodyParser = require('body-parser');

module.exports = express.Router()
.use(bodyParser.json())
.use('/', require('./comment'))
.use('/', require('./auth'));
