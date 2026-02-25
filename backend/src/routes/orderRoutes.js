const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  payOrder,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.post('/:id/payment', protect, payOrder);

module.exports = router;
