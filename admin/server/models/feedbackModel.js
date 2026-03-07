const pool = require('../db');

const FeedbackModel = {
    findAll: async () => {
        const result = await pool.query(
            `SELECT f.id, f.message, f.status, f.admin_reply, f.created_at, 
                    u.username, u.email as user_email
             FROM feedback f
             LEFT JOIN users u ON f.user_id = u.id
             ORDER BY f.created_at DESC`
        );
        return result.rows;
    },

    updateStatus: async (id, { status, admin_reply }) => {
        const result = await pool.query(
            `UPDATE feedback 
             SET status = $1, admin_reply = $2 
             WHERE id = $3 
             RETURNING id, user_id, message, status, admin_reply, created_at`,
            [status, admin_reply, id]
        );
        return result.rows[0];
    }
};

module.exports = FeedbackModel;
