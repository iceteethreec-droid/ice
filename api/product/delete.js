const express = require('express');
const { readFromFile, writeToFile } = require('soly-db');
const router = express.Router();

const PRODUCTS_FILE = 'products.json';

const getProducts = () => readFromFile(PRODUCTS_FILE);
const saveProducts = (products) => writeToFile(PRODUCTS_FILE, products);

const checkAdmin = require('../../middleware/checkAdmin');

router.delete('/delete/:id', checkAdmin, (req, res) => {
    const { id } = req.params;

    try {
        const products = getProducts();

        const productIndex = products.findIndex(p => p.id === id);

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบสินค้าที่ต้องการลบ'
            });
        }

        const deletedProduct = products.splice(productIndex, 1);

        saveProducts(products);

        res.status(200).json({
            success: true,
            message: 'ลบสินค้าสำเร็จ',
            product: deletedProduct[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการลบสินค้า'
        });
    }
});

module.exports = router;