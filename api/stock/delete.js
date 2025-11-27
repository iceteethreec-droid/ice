const express = require('express');
const { readFromFile, writeToFile } = require('soly-db');
const router = express.Router();

const STOCKS_FILE = 'stocks.json';

const getStocks = () => readFromFile(STOCKS_FILE);
const saveStocks = (stocks) => writeToFile(STOCKS_FILE, stocks);

const checkAdmin = require('../../middleware/checkAdmin');

router.delete('/delete/:id', checkAdmin, (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'กรุณาระบุ ID ของสต็อกที่ต้องการลบ'
        });
    }

    try {
        const stocks = getStocks();

        const stockIndex = stocks.findIndex(s => s.id === id);

        if (stockIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบสต็อกที่ต้องการลบ'
            });
        }

        const deletedStock = stocks.splice(stockIndex, 1);

        saveStocks(stocks);

        res.status(200).json({
            success: true,
            message: 'ลบข้อมูลสต็อกสำเร็จ',
            stock: deletedStock[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการลบข้อมูลสต็อก'
        });
    }
});

module.exports = router;