const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readFromFile, writeToFile } = require('soly-db');
const router = express.Router();

const CODES_FILE = 'codes.json';

const getCodes = () => readFromFile(CODES_FILE);
const saveCodes = (codes) => writeToFile(CODES_FILE, codes);

const checkAdmin = require('../../middleware/checkAdmin');

router.post('/generatecode', checkAdmin, (req, res) => {
    const { points } = req.body;

    if (!points || points <= 0) {
        return res.status(400).json({ success: false, message: 'กรุณากรอกจำนวนคะแนนที่ถูกต้อง' });
    }

    try {
        const codes = getCodes();

        const newCode = {
            id: uuidv4(),
            code: uuidv4(),
            points: points,
            timestamp: new Date().toISOString()
        };

        codes.push(newCode);

        saveCodes(codes);

        res.status(201).json({ success: true, message: 'โค้ดถูกสร้างและบันทึกสำเร็จ', code: newCode.code });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการสร้างโค้ด' });
    }
});

module.exports = router;