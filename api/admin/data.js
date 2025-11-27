const express = require('express');
const { readFromFile } = require('soly-db');
const router = express.Router();

const PRODUCTS_FILE = 'products.json';
const USERS_FILE = 'users.json';
const STOCKS_FILE = 'stocks.json';
const HISTORY_TOPUP_FILE = 'history_topup.json';

const getFileData = (file) => readFromFile(file);

const checkAdmin = require('../../middleware/checkAdmin');

router.get('/', checkAdmin, (req, res) => {
    try {
        const products = getFileData(PRODUCTS_FILE);
        const users = getFileData(USERS_FILE);
        const stocks = getFileData(STOCKS_FILE);
        const historyTopup = getFileData(HISTORY_TOPUP_FILE);

        const summary = {
            products: products.length,
            users: users.length,
            stocks: stocks.length,
            history_topup: historyTopup.length
        };

        res.status(200).json({
            success: true,
            message: 'ดึงข้อมูลสำเร็จ',
            summary
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
        });
    }
});

module.exports = router;