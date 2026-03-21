const UserModel = require('../models/userModel');

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.findAll();
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ message: err.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user:', err.message);
        res.status(500).json({ message: err.message });
    }
};

const syncUser = async (req, res) => {
    try {
        const { email, firebase_uid } = req.body;
        
        if (!email || !firebase_uid) {
            return res.status(400).json({ message: 'Email and firebase_uid are required' });
        }

        const existingUser = await UserModel.findByFirebaseUid(firebase_uid);
        if (existingUser) {
            return res.status(200).json({ 
                message: 'User already synced', 
                user: existingUser,
                isNew: false 
            });
        }

        const newUser = await UserModel.createFromFirebase(email, firebase_uid);
        res.status(201).json({ 
            message: 'User synced successfully', 
            user: newUser,
            isNew: true 
        });
    } catch (err) {
        console.error('Error syncing user:', err.message);
        res.status(500).json({ message: err.message });
    }
};

const checkBanStatus = async (req, res) => {
    try {
        const { firebase_uid } = req.query;
        
        if (!firebase_uid) {
            return res.status(400).json({ message: 'firebase_uid is required' });
        }

        const user = await UserModel.findByFirebaseUid(firebase_uid);
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found in database',
                is_banned: false,
                is_registered: false
            });
        }

        res.json({
            is_registered: true,
            is_banned: user.is_banned,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                interests: user.interests
            }
        });
    } catch (err) {
        console.error('Error checking ban status:', err.message);
        res.status(500).json({ message: err.message });
    }
};

const toggleBanUser = async (req, res) => {
    try {
        const user = await UserModel.toggleBan(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error toggling ban:', err.message);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    syncUser,
    checkBanStatus,
    toggleBanUser
};
