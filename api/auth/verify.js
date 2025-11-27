const express = require('express');
const jwt = require('jsonwebtoken');
const { readFromFile } = require('soly-db');
require('dotenv').config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_KEY;
const USERS_FILE = 'users.json';

const getUsers = () => readFromFile(USERS_FILE);

router.get('/verify', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'ไม่พบ token, กรุณาเข้าสู่ระบบ' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        const users = getUsers();
        const user = users.find(u => u.id === decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้ในระบบ' });
        }

        const response = {
            success: true,
            admin: user.role === 1
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(403).json({ success: false, message: 'Token ไม่ถูกต้องหรือหมดอายุ' });
    }
});

module.exports = router;