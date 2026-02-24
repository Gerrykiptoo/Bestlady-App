const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateKYC,
  getSalesAnalytics,
  getInventoryHealth
} = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/users', protect, admin, getUsers);
router.put('/users/:id/kyc', protect, admin, updateKYC);
router.get('/analytics/sales', protect, admin, getSalesAnalytics);
router.get('/analytics/inventory', protect, admin, getInventoryHealth);

module.exports = router;
