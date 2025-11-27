const express = require('express');
const { readFromFile, writeToFile } = require('soly-db');
const router = express.Router();

const USERS_FILE = 'users.json';

const getUsers = () => readFromFile(USERS_FILE);
const saveUsers = (users) => writeToFile(USERS_FILE, users);

const checkAdmin = require('../../middleware/checkAdmin');

router.get('/', checkAdmin, (req, res) => {
    try {
        user = getUsers();
        res.json(
            {
                success: true,
                message: "ดึงผู้ใช้ทั้งหมดสำเร็จ",
                users: user
            }
        )
    } catch (e) {
        console.log(e);
        res.json(
            {
                success: false,
                messsage: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์"
            }
        )
    }
});

router.put('/edit/:id', checkAdmin, (req, res) => {
    try {
        const { id } = req.params;
        const { username, role, points } = req.body;

        const users = getUsers();

        const userIndex = users.findIndex((user) => user.id === id);
        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบผู้ใช้ที่ต้องการแก้ไข",
            });
        }

        users[userIndex] = {
            ...users[userIndex],
            username,        
            role,           
            points    
        };

        saveUsers(users);

        res.json({
            success: true,
            message: "แก้ไขข้อมูลผู้ใช้สำเร็จ",
            user: users[userIndex],
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        });
    }
});

router.delete('/delete/:id', checkAdmin, (req, res) => {
    try {
        const { id } = req.params;
        const users = getUsers();

        const userIndex = users.findIndex((user) => user.id === id);
        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบผู้ใช้ที่ต้องการลบ"
            });
        }

        const deletedUser = users.splice(userIndex, 1);
        saveUsers(users);

        res.json({
            success: true,
            message: "ลบข้อมูลผู้ใช้สำเร็จ",
            user: deletedUser[0]
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์"
        });
    }
});

module.exports = router;