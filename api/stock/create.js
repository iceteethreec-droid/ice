const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readFromFile, writeToFile } = require('soly-db');
const router = express.Router();

const STOCKS_FILE = 'stocks.json';
const PRODUCTS_FILE = 'products.json';

const getStocks = () => readFromFile(STOCKS_FILE);
const saveStocks = (stocks) => writeToFile(STOCKS_FILE, stocks);

const getProducts = () => readFromFile(PRODUCTS_FILE);

const checkAdmin = require('../../middleware/checkAdmin');

router.post('/create', checkAdmin, (req, res) => {
    const { id_product, data } = req.body;

    if (!id_product || !data) {
        return res.status(400).json({
            success: false,
            message: 'กรุณาระบุ ID สินค้าและข้อมูลสต็อก'
        });
    }

    try {
        const products = getProducts();

        const product = products.find(p => p.id === id_product);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบสินค้าในระบบ'
            });
        }

        const stocks = getStocks();

        const newStock = {
            id: uuidv4(),
            product: {
                id: product.id,
                name: product.name,
                detail: product.detail
            },
            data,
            status: 0,
            ref: "",
            timestamp: new Date().toISOString()
        };

        stocks.push(newStock);

        saveStocks(stocks);

        res.status(201).json({
            success: true,
            message: 'สร้างข้อมูลสต็อกสำเร็จ',
            stock: newStock
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการสร้างข้อมูลสต็อก'
        });
    }
});

router.get('/', checkAdmin, (req, res) => {
    const stock = getStocks();

    try {
        res.json(
            {
                success: true,
                message: "ดึงข้อมูลสต็อกสำเร็จ",
                stocks: stock
            }
        )
    } catch (e) {
        console.log(e);
        res.json(
            {
                success: false,
                message: "เกิดข้อผิดพลาด"
            }
        )
    }
})

module.exports = router;