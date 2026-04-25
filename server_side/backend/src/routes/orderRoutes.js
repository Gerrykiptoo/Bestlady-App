const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  getPublicUnpaidOrder,
  payOrder,
  updateOrderStatus,
  handleMpesaCallback,
  verifyOrder,
  downloadReceipt
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public callback route (no authentication - called by Safaricom)
router.post('/mpesa-callback', handleMpesaCallback);

// Public payment-gateway route
// @route   GET /api/orders/public/:id
// @desc    Get unpaid order details for payment page
// @access  Public
router.get('/public/:id', getPublicUnpaidOrder);

// Protected routes (require authentication)
router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.post('/:id/pay', protect, payOrder);
router.post('/:id/verify', protect, verifyOrder);
router.get('/:id/receipt', protect, downloadReceipt);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
