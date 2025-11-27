const express = require('express');
const router = express.Router();

const user = require('../api/admin/user');
const data = require('../api/admin/data');

router.use('/user', user);
router.use('/data', data);

module.exports = router;