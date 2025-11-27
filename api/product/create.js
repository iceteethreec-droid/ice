const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readFromFile, writeToFile } = require('soly-db');
const router = express.Router();

const PRODUCTS_FILE = 'products.json';
const STOCKS_FILE = 'stocks.json';

const getProducts = () => readFromFile(PRODUCTS_FILE);
const getStocks = () => readFromFile(STOCKS_FILE);
const saveProducts = (products) => writeToFile(PRODUCTS_FILE, products);

const checkAdmin = require('../../middleware/checkAdmin');

router.post('/create', checkAdmin, (req, res) => {
    const { name, detail, price, image_url } = req.body;

    if (!name || !detail || !price || price <= 0 || !image_url) {
        return res.status(400).json({
            success: false,
            message: 'กรุณากรอกข้อมูลสินค้าให้ครบถ้วนและราคาต้องมากกว่า 0 และต้องมี URL ของภาพ'
        });
    }

    try {
        const products = getProducts();

        const newProduct = {
            id: uuidv4(),
            image_url,
            name,
            detail,
            price,
            timestamp: new Date().toISOString()
        };

        products.push(newProduct);

        saveProducts(products);

        res.status(201).json({
            success: true,
            message: 'สร้างสินค้าสำเร็จ',
            product: newProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการสร้างสินค้า'
        });
    }
});

router.get('/', (req, res) => {
    try {
        const products = getProducts();
        const stocks = getStocks();

        const productsWithStock = products.map(product => {
            const stockCount = stocks.filter(stock => stock.product.id === product.id).length;
            return {
                ...product,
                stock: stockCount
            };
        });

        res.status(200).json({
            success: true,
            message: 'ดึงข้อมูลสินค้าสำเร็จ',
            products: productsWithStock
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า'
        });
    }
});

router.get('/:id', (req, res) => {
    const { id } = req.params;

    try {
        const products = getProducts();
        const product = products.find(p => p.id === id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบสินค้าตาม id ที่ระบุ'
            });
        }

        const stocks = getStocks();
        const stockCount = stocks.filter(stock => stock.product.id === product.id).length;

        res.status(200).json({
            success: true,
            message: 'ดึงข้อมูลสินค้าสำเร็จ',
            product: { ...product, stock: stockCount }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า'
        });
    }
});

module.exports = router;