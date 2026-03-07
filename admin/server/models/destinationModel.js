// ============================================
// Model: Destination (ตาราง destinations + destination_images)
// จัดการ query ที่เกี่ยวข้องกับสถานที่ท่องเที่ยว
// ============================================

const db = require('../db');

/**
 * ดึงรายการสถานที่ทั้งหมด พร้อมตัวกรอง
 * @param {object} filters - ตัวกรอง { province, status, search }
 * @returns {Array} - รายการสถานที่ท่องเที่ยว
 */
async function findAll(filters = {}) {
    const { province, status, search } = filters;
    let sql = 'SELECT * FROM destinations WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (province) {
        sql += ` AND province = $${paramIndex++}`;
        params.push(province);
    }
    if (status) {
        sql += ` AND status = $${paramIndex++}`;
        params.push(status);
    }
    if (search) {
        sql += ` AND name ILIKE $${paramIndex++}`;
        params.push(`%${search}%`);
    }

    sql += ' ORDER BY created_at DESC';

    const { rows } = await db.query(sql, params);
    return rows;
}

/**
 * ดึงข้อมูลสถานที่ตาม ID พร้อมรูปภาพ
 * @param {number} id - ID ของสถานที่
 * @returns {object|null} - ข้อมูลสถานที่พร้อมรูปภาพ หรือ null ถ้าไม่พบ
 */
async function findById(id) {
    const { rows } = await db.query(
        'SELECT * FROM destinations WHERE id = $1',
        [id]
    );

    if (rows.length === 0) return null;

    const { rows: images } = await db.query(
        'SELECT * FROM destination_images WHERE destination_id = $1',
        [id]
    );

    return { ...rows[0], images };
}

/**
 * สร้างสถานที่ใหม่พร้อมรูปภาพ
 * @param {object} data - ข้อมูลสถานที่
 * @returns {number} - ID ของสถานที่ที่สร้างใหม่
 */
async function create(data) {
    const {
        name, province, description,
        latitude, longitude,
        opening_time, closing_time,
        status, image_url, images
    } = data;

    const lat = latitude !== '' && latitude != null ? parseFloat(latitude) : null;
    const lng = longitude !== '' && longitude != null ? parseFloat(longitude) : null;

    const { rows: insertRows } = await db.query(
        `INSERT INTO destinations 
        (name, province, description, latitude, longitude, opening_time, closing_time, status, source, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'admin', $9)
        RETURNING id`,
        [
            name.trim(),
            province || null,
            description || null,
            lat, lng,
            opening_time || '00:00 AM',
            closing_time || '00:00 PM',
            status || 'published',
            image_url || null
        ]
    );

    const destId = insertRows[0].id;

    // เพิ่มรูปภาพทั้งหมดลงตาราง destination_images
    await insertImages(destId, images);

    return destId;
}

/**
 * อัปเดตข้อมูลสถานที่ (เฉพาะข้อมูลที่สร้างโดย Admin)
 * @param {number} id - ID ของสถานที่
 * @param {object} data - ข้อมูลที่ต้องการอัปเดต
 * @returns {boolean} - true ถ้าอัปเดตสำเร็จ, false ถ้าไม่พบ
 */
async function update(id, data) {
    const {
        name, province, description,
        latitude, longitude,
        opening_time, closing_time,
        status, image_url, images
    } = data;

    const lat = latitude !== '' && latitude != null ? parseFloat(latitude) : null;
    const lng = longitude !== '' && longitude != null ? parseFloat(longitude) : null;

    const result = await db.query(
        `UPDATE destinations 
        SET name=$1, province=$2, description=$3, latitude=$4, longitude=$5,
        opening_time=$6, closing_time=$7, status=$8, image_url=$9
        WHERE id=$10 AND source='admin'`,
        [
            name, province || null, description || null,
            lat, lng,
            opening_time, closing_time,
            status, image_url || null,
            id
        ]
    );

    if (result.rowCount === 0) return false;

    // ลบรูปภาพเก่าทั้งหมด แล้วเพิ่มรูปใหม่
    await db.query('DELETE FROM destination_images WHERE destination_id = $1', [id]);
    await insertImages(id, images);

    return true;
}

/**
 * ลบสถานที่ (เฉพาะข้อมูลที่สร้างโดย Admin)
 * @param {number} id - ID ของสถานที่
 * @returns {boolean} - true ถ้าลบสำเร็จ, false ถ้าไม่พบ
 */
async function remove(id) {
    const result = await db.query(
        'DELETE FROM destinations WHERE id = $1 AND source = $2',
        [id, 'admin']
    );
    return result.rowCount > 0;
}

// ============================================
// ฟังก์ชันภายใน (Private Helper)
// ============================================

/**
 * เพิ่มรูปภาพหลายรูปลงตาราง destination_images
 * @param {number} destId - ID ของสถานที่
 * @param {Array} images - รายการ URL รูปภาพ
 */
async function insertImages(destId, images) {
    const imageList = Array.isArray(images) ? images : [];
    for (const url of imageList) {
        if (url) {
            await db.query(
                'INSERT INTO destination_images (destination_id, image_url) VALUES ($1, $2)',
                [destId, url]
            );
        }
    }
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};
