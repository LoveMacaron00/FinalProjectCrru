const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/check-banned', userController.checkBanStatus);
router.get('/:id', userController.getUserById);
router.post('/sync', userController.syncUser);
router.put('/:id/ban', userController.toggleBanUser);

module.exports = router;
