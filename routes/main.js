const express = require('express');
const router = express.Router();

const auth = require('../api/auth');
const topup = require('../api/topup');
const product = require('../api/product');
const stock = require('../api/stock');
const admin = require('../api/admin');
const buy = require('../api/buy');
const profile = require('../api/profile');

router.use('/auth', auth);
router.use('/topup', topup);
router.use('/product', product);
router.use('/stock', stock);
router.use('/admin', admin);
router.use('/buy', buy);
router.use('/profile', profile);

module.exports = router;