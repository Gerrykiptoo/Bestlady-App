const express = require('express');
const router = express.Router();
const { getStaffStats } = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('staff', 'admin'));

router.get('/stats', getStaffStats);

module.exports = router;
