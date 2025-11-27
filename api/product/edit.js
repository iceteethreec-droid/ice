const express = require('express');
const { readFromFile, writeToFile } = require('soly-db');
const router = express.Router();

const PRODUCTS_FILE = 'products.json';

const getProducts = () => readFromFile(PRODUCTS_FILE);
const saveProducts = (products) => writeToFile(PRODUCTS_FILE, products);

const checkAdmin = require('../../middleware/checkAdmin');

router.put('/edit/:id', checkAdmin, (req, res) => {
    const { id } = req.params;
    const { name, detail, price } = req.body;

    if (!name || !detail || !price || price <= 0) {
        return res.status(400).json({
            success: false,
            message: 'กรุณากรอกข้อมูลสินค้าให้ครบถ้วนและราคาต้องมากกว่า 0'
        });
    }

    try {
        const products = getProducts();

        const productIndex = products.findIndex(p => p.id === id);

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบสินค้าที่ต้องการแก้ไข'
            });
        }

        products[productIndex] = {
            ...products[productIndex],
            name,
            detail,
            price,
            timestamp: new Date().toISOString()
        };

        saveProducts(products);

        res.status(200).json({
            success: true,
            message: 'แก้ไขสินค้าสำเร็จ',
            product: products[productIndex]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการแก้ไขสินค้า'
        });
    }
});

module.exports = router;