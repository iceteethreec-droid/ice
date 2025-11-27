const express = require('express');
const jwt = require('jsonwebtoken');
const { readFromFile, writeToFile } = require('soly-db');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const SECRET_KEY = process.env.JWT_KEY;
const USERS_FILE = 'users.json';
const CODES_FILE = 'codes.json';
const HISTORY_FILE = 'history_topup.json';

const getUsers = () => readFromFile(USERS_FILE);
const saveUsers = (users) => writeToFile(USERS_FILE, users);
const getCodes = () => readFromFile(CODES_FILE);
const getHistory = () => readFromFile(HISTORY_FILE);
const saveHistory = (history) => writeToFile(HISTORY_FILE, history);

router.post('/code', (req, res) => {
    const { code } = req.body;
    const token = req.cookies.token;

    if (!code) {
        return res.status(400).json({ success: false, message: 'กรุณากรอกโค้ด' });
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'ไม่พบ token, กรุณาเข้าสู่ระบบ' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;

        const users = getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้ในระบบ' });
        }

        const codes = getCodes();
        const validCode = codes.find(c => c.code === code);

        if (!validCode) {
            return res.status(404).json({ success: false, message: 'โค้ดไม่ถูกต้อง' });
        }

        user.points += validCode.points;

        const history = getHistory();
        const newHistoryEntry = {
            id: uuidv4(),
            points: validCode.points,
            username: user.username,
            code: validCode.code,
            timestamp: new Date().toISOString()
        };

        history.push(newHistoryEntry);
        saveHistory(history);

        saveUsers(users);

        res.status(200).json({
            success: true,
            message: 'แลกเงินโค้ดสำเร็จ',
            points: user.points
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการแลกโค้ด' });
    }
});

module.exports = router;