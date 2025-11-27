const express = require('express');
const jwt = require('jsonwebtoken');
const { readFromFile } = require('soly-db');
const router = express.Router();
require('dotenv').config();
const SECRET_KEY = process.env.JWT_KEY;

const USERS_FILE = 'users.json';

const getUsers = () => readFromFile(USERS_FILE);

router.get('/', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token ไม่ถูกต้องหรือหมดอายุ'
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token ไม่ถูกต้องหรือหมดอายุ'
      });
    }

    const userId = decoded.id;

    try {
      const users = getUsers();
      const user = users.find(user => user.id === userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลผู้ใช้'
        });
      }

      res.status(200).json({
        success: true,
        username: user.username,
        points: user.points,
        role: user.role,
        timestamp: user.timestamp
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้'
      });
    }
  });
});

module.exports = router;