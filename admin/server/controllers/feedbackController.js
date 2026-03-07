const FeedbackModel = require('../models/feedbackModel');

const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await FeedbackModel.findAll();
        res.json(feedbacks);
    } catch (err) {
        console.error('Error fetching feedback:', err.message);
        res.status(500).json({ message: err.message });
    }
};

const updateFeedback = async (req, res) => {
    try {
        const { status, admin_reply } = req.body;
        const feedback = await FeedbackModel.updateStatus(req.params.id, { status, admin_reply });
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json(feedback);
    } catch (err) {
        console.error('Error updating feedback:', err.message);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllFeedback,
    updateFeedback
};
