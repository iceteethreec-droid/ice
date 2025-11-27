const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readFromFile, writeToFile } = require('soly-db');
require('dotenv').config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_KEY;
const USERS_FILE = 'users.json';

const getUsers = () => readFromFile(USERS_FILE);
const saveUsers = (users) => writeToFile(USERS_FILE, users);

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
    }

    try {
        const users = getUsers();

        if (users.some(user => user.username === username)) {
            return res.status(400).json({ success: false, message: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: uuidv4(),
            username,
            password: hashedPassword,
            role: 0,
            points: 0,
            timestamp: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        const token = jwt.sign({ id: newUser.id, role: newUser.role }, SECRET_KEY, { expiresIn: '1h' });
        const sevenDaysInMilliseconds = 3600 * 1000;

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: sevenDaysInMilliseconds,
            sameSite: 'Strict'
        });

        res.status(201).json({ success: true, message: 'ลงทะเบียนสำเร็จ' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
    }
});

module.exports = router;