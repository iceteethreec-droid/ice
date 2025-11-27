const express = require('express');
const router = express.Router();

const create = require('./stock/create');
const deletes = require('./stock/delete');

router.use('/', create, deletes);

module.exports = router;