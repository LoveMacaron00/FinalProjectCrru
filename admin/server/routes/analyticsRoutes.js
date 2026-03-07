// ============================================
// Routes: Analytics (เส้นทางสถิติภาพรวม)
// กำหนดเส้นทาง API สำหรับข้อมูลสถิติแดชบอร์ด
// ============================================

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// GET /api/analytics/overview - ดึงข้อมูลสถิติภาพรวม
router.get('/overview', analyticsController.getOverview);

module.exports = router;
