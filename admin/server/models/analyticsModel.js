// ============================================
// Model: Analytics (ข้อมูลสถิติ)
// จัดการ query สำหรับแดชบอร์ดสถิติภาพรวม
// ============================================

const db = require('../db');

/**
 * นับจำนวนสถานที่ท่องเที่ยวทั้งหมด
 * @returns {number} - จำนวนสถานที่ทั้งหมดในฐานข้อมูล
 */
async function getTotalDestinations() {
    const { rows } = await db.query('SELECT COUNT(*) AS total FROM destinations');
    return parseInt(rows[0].total, 10);
}

/**
 * ดึงข้อมูลภาพรวมสถิติ (ข้อมูลจำลอง + ข้อมูลจริงจาก DB)
 * @returns {object} - ข้อมูลสถิติภาพรวมสำหรับแดชบอร์ด
 */
async function getOverview() {
    const totalDestinations = await getTotalDestinations();

    return {
        totalDestinations,
        monthlyActiveUsers: 12450,
        peakUsageTime: '14:00 - 16:00',
        visits: 245000,
        visitGrowth: 15.3,
        topDestinations: [
            { name: 'Grand Palace', percent: 92, color: '#10B981' },
            { name: 'Phi Phi Islands', percent: 84, color: '#8B5CF6' },
            { name: 'Old City', percent: 76, color: '#3B82F6' },
            { name: 'Big Buddha', percent: 65, color: '#F59E0B' }
        ],
        trafficData: [
            { date: 'Jan 01', value: 120 },
            { date: 'Jan 05', value: 150 },
            { date: 'Jan 10', value: 180 },
            { date: 'Jan 15', value: 220 },
            { date: 'Jan 20', value: 260 },
            { date: 'Jan 25', value: 310 },
            { date: 'Jan 30', value: 380 }
        ]
    };
}

module.exports = {
    getTotalDestinations,
    getOverview
};
