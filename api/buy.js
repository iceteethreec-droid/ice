const express = require('express');
const router = express.Router();

const buy = require('./buy/buy');

router.use('/', buy);

module.exports = router;