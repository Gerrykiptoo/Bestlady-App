const express = require('express');
const router = express.Router();
const { getUserDashboardData, getAdminForecast, aiChat } = require('../controllers/aiController');
const { protect, admin, optionalProtect } = require('../middleware/authMiddleware');

// @route   GET /api/ai/user/dashboard
// @access  Private
router.get('/user/dashboard', protect, getUserDashboardData);

// @route   GET /api/ai/admin/forecast
// @access  Private/Admin
router.get('/admin/forecast', protect, admin, getAdminForecast);

// @route   POST /api/ai/chat
// @desc    AI Chat Assistant
// @access  Public/Optional Auth
router.post('/chat', optionalProtect, aiChat);

module.exports = router;
