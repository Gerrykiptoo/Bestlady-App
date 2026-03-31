const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateKYC,
  getSalesAnalytics,
  getInventoryHealth,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, getUsers);
router.post('/users', protect, admin, createUser);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/kyc', protect, admin, updateKYC);
router.get('/analytics/sales', protect, admin, getSalesAnalytics);
router.get('/analytics/inventory', protect, admin, getInventoryHealth);

module.exports = router;
