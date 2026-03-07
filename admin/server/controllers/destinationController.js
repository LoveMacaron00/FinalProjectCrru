// ============================================
// Controller: Destination (สถานที่ท่องเที่ยว)
// จัดการ logic CRUD สำหรับสถานที่ท่องเที่ยว
// ============================================

const DestinationModel = require('../models/destinationModel');

/**
 * ดึงรายการสถานที่ทั้งหมด (รองรับตัวกรอง)
 * GET /api/destinations
 */
const getAllDestinations = async (req, res) => {
    try {
        const { province, status, search } = req.query;
        const destinations = await DestinationModel.findAll({ province, status, search });
        res.json(destinations);
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการดึงรายการสถานที่:', err.message);
        res.status(500).json({ message: err.message });
    }
};

/**
 * ดึงข้อมูลสถานที่ตาม ID พร้อมรูปภาพ
 * GET /api/destinations/:id
 */
const getDestinationById = async (req, res) => {
    try {
        const destination = await DestinationModel.findById(req.params.id);

        if (!destination) {
            return res.status(404).json({ message: 'ไม่พบสถานที่' });
        }

        res.json(destination);
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสถานที่:', err.message);
        res.status(500).json({ message: err.message });
    }
};

/**
 * สร้างสถานที่ใหม่
 * POST /api/destinations
 */
const createDestination = async (req, res) => {
    try {
        const { name } = req.body;

        // ตรวจสอบว่ากรอกชื่อสถานที่หรือไม่
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อสถานที่' });
        }

        const destId = await DestinationModel.create(req.body);
        res.status(201).json({ id: destId, message: 'เพิ่มสถานที่สำเร็จ' });
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการเพิ่มสถานที่:', err.message);
        res.status(400).json({ message: err.message });
    }
};

/**
 * อัปเดตข้อมูลสถานที่
 * PUT /api/destinations/:id
 */
const updateDestination = async (req, res) => {
    try {
        const updated = await DestinationModel.update(req.params.id, req.body);

        if (!updated) {
            return res.status(404).json({ message: 'ไม่พบสถานที่ หรือไม่ใช่ข้อมูลของ Admin' });
        }

        res.json({ message: 'อัปเดตสถานที่สำเร็จ' });
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการอัปเดตสถานที่:', err.message);
        res.status(400).json({ message: err.message });
    }
};

/**
 * ลบสถานที่
 * DELETE /api/destinations/:id
 */
const deleteDestination = async (req, res) => {
    try {
        const deleted = await DestinationModel.remove(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'ไม่พบสถานที่ หรือไม่ใช่ข้อมูลของ Admin' });
        }

        res.json({ message: 'ลบสถานที่สำเร็จ' });
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการลบสถานที่:', err.message);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllDestinations,
    getDestinationById,
    createDestination,
    updateDestination,
    deleteDestination
};
