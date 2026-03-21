const pool = require('../db');

const UserModel = {
    findAll: async () => {
        const result = await pool.query(
            `SELECT id, email, firebase_uid, username, interests, is_private_location, is_banned, created_at 
             FROM users 
             ORDER BY created_at DESC`
        );
        return result.rows;
    },

    findById: async (id) => {
        const result = await pool.query(
            `SELECT id, email, firebase_uid, username, interests, is_private_location, is_banned, created_at 
             FROM users WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    },

    findByFirebaseUid: async (firebaseUid) => {
        const result = await pool.query(
            `SELECT id, email, firebase_uid, username, interests, is_private_location, is_banned, created_at 
             FROM users WHERE firebase_uid = $1`,
            [firebaseUid]
        );
        return result.rows[0];
    },

    createFromFirebase: async (email, firebaseUid) => {
        const result = await pool.query(
            `INSERT INTO users (email, firebase_uid) 
             VALUES ($1, $2) 
             RETURNING id, email, firebase_uid, username, interests, is_private_location, is_banned, created_at`,
            [email, firebaseUid]
        );
        return result.rows[0];
    },

    getBanStatus: async (firebaseUid) => {
        const result = await pool.query(
            `SELECT is_banned FROM users WHERE firebase_uid = $1`,
            [firebaseUid]
        );
        return result.rows[0] ? result.rows[0].is_banned : null;
    },

    toggleBan: async (id) => {
        const result = await pool.query(
            `UPDATE users SET is_banned = NOT is_banned WHERE id = $1 
             RETURNING id, email, firebase_uid, username, interests, is_private_location, is_banned, created_at`,
            [id]
        );
        return result.rows[0];
    }
};

module.exports = UserModel;
