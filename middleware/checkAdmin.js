const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_KEY;

const checkAdmin = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'กรุณาเข้าสู่ระบบ' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        if (decoded.role !== 1) {
            return res.status(403).json({ success: false, message: 'คุณไม่มีสิทธิ์เข้าถึงเส้นทางนี้' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(403).json({ success: false, message: 'Token ไม่ถูกต้องหรือหมดอายุ' });
    }
};

module.exports = checkAdmin;