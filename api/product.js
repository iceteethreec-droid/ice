const express = require('express');
const router = express.Router();

const create = require('./product/create');
const edit = require('./product/edit');
const deletes = require('./product/delete');

router.use('/', create, edit, deletes);

module.exports = router;