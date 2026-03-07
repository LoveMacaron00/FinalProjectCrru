-- Smart Travel Admin Database Schema (PostgreSQL)

-- Extensions
CREATE EXTENSION IF NOT EXISTS vector;

-- ตาราง admins
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    username VARCHAR(150),
    interests TEXT[],
    is_private_location BOOLEAN DEFAULT false,
    is_banned BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง feedback
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    admin_reply TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง destinations
CREATE TABLE IF NOT EXISTS destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    province VARCHAR(100),
    description TEXT,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    opening_time VARCHAR(20) DEFAULT '00:00 AM',
    closing_time VARCHAR(20) DEFAULT '00:00 PM',
    category VARCHAR(100) DEFAULT 'General',
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    source VARCHAR(20) DEFAULT 'admin' CHECK (source IN ('admin', 'tat_api')),
    image_url TEXT,
    -- AI embedding
    embedding VECTOR(1536),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง destination_images
CREATE TABLE IF NOT EXISTS destination_images (
    id SERIAL PRIMARY KEY,
    destination_id INT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function + Trigger สำหรับ auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER destinations_updated_at
BEFORE UPDATE ON destinations
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Insert default admin
INSERT INTO admins (email, password)
VALUES ('admin123', '135790')
ON CONFLICT (email) DO NOTHING;

-- IVFFlat index (รัน หลังจาก insert ข้อมูล embedding แล้ว)
-- CREATE INDEX destinations_embedding_idx
-- ON destinations
-- USING ivfflat (embedding vector_cosine_ops)
-- WITH (lists = 100);