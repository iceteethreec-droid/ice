const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readFromFile } = require('soly-db');
require('dotenv').config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_KEY;
const USERS_FILE = 'users.json';

const getUsers = () => readFromFile(USERS_FILE);

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
    }

    try {
        const users = getUsers();

        const user = users.find(user => user.username === username);

        if (!user) {
            return res.status(400).json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        const sevenDaysInMilliseconds = 3600 * 1000;

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: sevenDaysInMilliseconds,
            sameSite: 'Strict'
        });

        res.status(200).json({ success: true, message: 'เข้าสู่ระบบสำเร็จ' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
    }
});

module.exports = router;