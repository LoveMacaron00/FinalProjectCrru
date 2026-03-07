const pool = require('../db');

const UserModel = {
    findAll: async () => {
        const result = await pool.query(
            `SELECT id, email, username, interests, is_private_location, is_banned, created_at 
             FROM users 
             ORDER BY created_at DESC`
        );
        return result.rows;
    },

    findById: async (id) => {
        const result = await pool.query(
            `SELECT id, email, username, interests, is_private_location, is_banned, created_at 
             FROM users WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    },

    toggleBan: async (id) => {
        const result = await pool.query(
            `UPDATE users SET is_banned = NOT is_banned WHERE id = $1 
             RETURNING id, email, username, interests, is_private_location, is_banned, created_at`,
            [id]
        );
        return result.rows[0];
    }
};

module.exports = UserModel;
