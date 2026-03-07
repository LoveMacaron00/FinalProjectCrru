// ============================================
// Controller: Auth (การยืนยันตัวตน)
// จัดการ logic การเข้าสู่ระบบของแอดมิน
// ============================================

const AdminModel = require('../models/adminModel');

/**
 * เข้าสู่ระบบแอดมิน
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
        if (!email || !password) {
            return res.status(400).json({ message: 'กรุณากรอก Email และ Password' });
        }

        // ค้นหาแอดมินจากฐานข้อมูล
        const admin = await AdminModel.findByCredentials(email, password);

        if (!admin) {
            return res.status(401).json({ message: 'Email หรือ Password ไม่ถูกต้อง' });
        }

        res.json({
            message: 'เข้าสู่ระบบสำเร็จ',
            admin
        });
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ:', err.message);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    login
};
