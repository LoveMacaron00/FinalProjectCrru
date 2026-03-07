// ============================================
// Model: Admin (ตาราง admins)
// จัดการ query ที่เกี่ยวข้องกับผู้ดูแลระบบ
// ============================================

const db = require('../db');

/**
 * ค้นหาแอดมินจาก email และ password
 * @param {string} email - อีเมลของแอดมิน
 * @param {string} password - รหัสผ่านของแอดมิน
 * @returns {object|null} - ข้อมูลแอดมิน (id, email) หรือ null ถ้าไม่พบ
 */
async function findByCredentials(email, password) {
    const { rows } = await db.query(
        'SELECT id, email FROM admins WHERE email = $1 AND password = $2',
        [email, password]
    );
    return rows.length > 0 ? rows[0] : null;
}

module.exports = {
    findByCredentials
};
