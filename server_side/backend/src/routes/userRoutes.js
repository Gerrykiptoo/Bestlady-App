const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadAvatar } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// GET /api/users/profile – get current user profile
router.get('/profile', protect, getProfile);

// PUT /api/users/profile – update nickname
router.put('/profile', protect, updateProfile);

// POST /api/users/avatar – upload avatar
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;   // ✅ must export the router