const express = require('express');
const router = express.Router();
const { getUserDashboardData, getAdminForecast, aiChat, bulkOptimize } = require('../controllers/aiController');
const { protect, admin, optionalProtect } = require('../middleware/authMiddleware');

// @route   GET /api/ai/user/dashboard
// @access  Public/Optional Auth
router.get('/user/dashboard', optionalProtect, getUserDashboardData);

// @route   GET /api/ai/admin/forecast
// @access  Private/Admin
router.get('/admin/forecast', protect, admin, getAdminForecast);

// @route   POST /api/ai/chat
// @desc    AI Chat Assistant
// @access  Public/Optional Auth
router.post('/chat', optionalProtect, aiChat);

// @route   POST /api/ai/bulk-optimize
// @desc    AI Bulk Order Optimizer - recommends optimal quantities based on purchase history
// @access  Private (Authenticated)
router.post('/bulk-optimize', protect, bulkOptimize);

module.exports = router;


