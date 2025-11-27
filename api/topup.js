const express = require('express');
const router = express.Router();

const generatecode = require('./topup/gencode');
const topup = require('./topup/topup');

router.use('/', generatecode, topup)

module.exports = router;