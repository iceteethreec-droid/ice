const express = require('express');
const router = express.Router();

const register = require('./auth/register');
const login = require('./auth/login');
const logout = require('./auth/logout');
const verify = require('./auth/verify');

router.use('/', register, login, logout, verify);

module.exports = router;