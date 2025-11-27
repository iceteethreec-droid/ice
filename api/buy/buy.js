const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readFromFile, writeToFile } = require('soly-db');
const router = express.Router();

const SECRET_KEY = process.env.JWT_KEY;
const PRODUCTS_FILE = 'products.json';
const USERS_FILE = 'users.json';
const STOCKS_FILE = 'stocks.json';

const getProducts = () => readFromFile(PRODUCTS_FILE);
const getUsers = () => readFromFile(USERS_FILE);
const getStocks = () => readFromFile(STOCKS_FILE);
const saveStocks = (stocks) => writeToFile(STOCKS_FILE, stocks);

router.post('/purchase', (req, res) => {
    const { id_product, quantity } = req.body;
    const token = req.cookies.token;

    if (!id_product || !quantity || quantity <= 0) {
        return res.status(400).json({
            success: false,
            message: 'กรุณาระบุ ID สินค้าและจำนวนที่ถูกต้อง',
        });
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'กรุณาเข้าสู่ระบบเพื่อทำการสั่งซื้อ',
        });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;

        const users = getUsers();
        const user = users.find((u) => u.id === userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบข้อมูลผู้ใช้',
            });
        }

        const products = getProducts();
        const product = products.find((p) => p.id === id_product);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบสินค้าในระบบ',
            });
        }

        const stocks = getStocks();
        const availableStocks = stocks.filter(
            (s) => s.product.id === id_product && s.status === 0 && s.ref === ""
        );

        if (availableStocks.length < quantity) {
            return res.status(400).json({
                success: false,
                message: 'จำนวนสินค้าในสต็อกไม่เพียงพอ',
            });
        }

        let remainingQuantity = quantity;

        const updatedStocks = stocks.map((stock) => {
            if (
                stock.product.id === id_product &&
                stock.status === 0 &&
                stock.ref === "" &&
                remainingQuantity > 0
            ) {
                let updatedStock = { ...stock };
                updatedStock.status = 1;
                updatedStock.ref = userId;
                remainingQuantity--;
                return updatedStock;
            }
            return stock;
        });

        saveStocks(updatedStocks);

        res.status(200).json({
            success: true,
            message: 'การสั่งซื้อสำเร็จ',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการสั่งซื้อสินค้า',
        });
    }
});

module.exports = router;