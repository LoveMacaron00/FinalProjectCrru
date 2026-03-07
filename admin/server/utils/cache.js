// ============================================
// ระบบ In-Memory Cache พร้อม TTL (Time To Live)
// ใช้สำหรับ cache ข้อมูลจาก TAT API
// ============================================

const CACHE_TTL = 5 * 60 * 1000; // กำหนด TTL 5 นาที
const cache = new Map();

/**
 * ดึงข้อมูลจาก cache ตาม key
 * @param {string} key - คีย์สำหรับค้นหาข้อมูลใน cache
 * @returns {any|null} - ข้อมูลที่ cache ไว้ หรือ null ถ้าหมดอายุ/ไม่มี
 */
function getCached(key) {
    const entry = cache.get(key);
    if (!entry) return null;

    // ตรวจสอบว่า cache หมดอายุหรือยัง
    if (Date.now() - entry.ts > CACHE_TTL) {
        cache.delete(key);
        return null;
    }

    return entry.data;
}

/**
 * บันทึกข้อมูลลง cache
 * @param {string} key - คีย์สำหรับจัดเก็บ
 * @param {any} data - ข้อมูลที่ต้องการ cache
 */
function setCache(key, data) {
    cache.set(key, { data, ts: Date.now() });

    // ลบ cache เก่าหากมีมากกว่า 200 entries
    if (cache.size > 200) {
        const oldest = cache.keys().next().value;
        cache.delete(oldest);
    }
}

module.exports = { getCached, setCache };
