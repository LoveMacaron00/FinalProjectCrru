// ============================================
// Server: จุดเริ่มต้นของแอปพลิเคชัน Express
// ตั้งค่า middleware และเชื่อมต่อ routes ทั้งหมด
// ============================================

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');

// โหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// ตั้งค่า Middleware
// ============================================
app.use(morgan('dev'));
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '20mb' }));

// ให้บริการไฟล์รูปภาพที่อัปโหลด
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// ============================================
// เชื่อมต่อ Routes ทั้งหมด
// ============================================
const authRoutes = require('./routes/auth');
const destinationRoutes = require('./routes/destinationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const tatRoutes = require('./routes/tat');
const userRoutes = require('./routes/userRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

app.use('/api/auth', authRoutes);            // เส้นทางการยืนยันตัวตน
app.use('/api/destinations', destinationRoutes); // เส้นทาง CRUD สถานที่
app.use('/api/analytics', analyticsRoutes);  // เส้นทางสถิติภาพรวม
app.use('/api/upload', uploadRoutes);        // เส้นทางอัปโหลดรูปภาพ
app.use('/api/v2', tatRoutes);               // เส้นทาง TAT API ภายนอก
app.use('/api/users', userRoutes);           // เส้นทางจัดการผู้ใช้
app.use('/api/feedback', feedbackRoutes);   // เส้นทางจัดการ feedback

// เส้นทางตรวจสอบสถานะ API
app.get('/', (req, res) => {
    res.send('Smart Travel Admin API กำลังทำงาน');
});

// ============================================
// เริ่มต้น Server
// ============================================
app.listen(PORT, () => {
    console.log(`เซิร์ฟเวอร์กำลังทำงานบนพอร์ต ${PORT}`);
});
