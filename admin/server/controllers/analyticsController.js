// Controller: Analytics (สถิติภาพรวม)
const AnalyticsModel = require('../models/analyticsModel');

/**
 * ดึงข้อมูลสถิติภาพรวมสำหรับแดชบอร์ด
 * GET /api/analytics/overview
 */
const getOverview = async (req, res) => {
    try {
        const overview = await AnalyticsModel.getOverview();
        res.json(overview);
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ:', err.message);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getOverview
};
