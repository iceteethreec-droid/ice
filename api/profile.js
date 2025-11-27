const express = require('express');
const router = express.Router();

const get = require('./profile/get');

router.use('/', get);

module.exports = router;