// ============================================
// Routes: Destination (เส้นทางสถานที่ท่องเที่ยว)
// กำหนดเส้นทาง API สำหรับ CRUD สถานที่
// ============================================

const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

// GET    /api/destinations     - ดึงรายการสถานที่ทั้งหมด (รองรับตัวกรอง)
router.get('/', destinationController.getAllDestinations);

// GET    /api/destinations/:id - ดึงข้อมูลสถานที่ตาม ID
router.get('/:id', destinationController.getDestinationById);

// POST   /api/destinations     - สร้างสถานที่ใหม่
router.post('/', destinationController.createDestination);

// PUT    /api/destinations/:id - อัปเดตข้อมูลสถานที่
router.put('/:id', destinationController.updateDestination);

// DELETE /api/destinations/:id - ลบสถานที่
router.delete('/:id', destinationController.deleteDestination);

module.exports = router;
