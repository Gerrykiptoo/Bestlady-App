const express = require('express');
const router = express.Router();
const { getUserDashboardData, getAdminForecast } = require('../controllers/aiController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/ai/user/dashboard
// @access  Private
router.get('/user/dashboard', protect, getUserDashboardData);

// @route   GET /api/ai/admin/forecast
// @access  Private/Admin
router.get('/admin/forecast', protect, admin, getAdminForecast);

module.exports = router;
