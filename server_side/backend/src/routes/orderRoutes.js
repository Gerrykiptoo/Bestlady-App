const express = require('express');
const multer = require('multer');
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
  downloadReceipt,
  createOrderForClient,
  bulkCreateOrder,
  cancelOrder,
  exportOrdersPDF
} = require('../controllers/orderController');
const { protect, admin, authorize } = require('../middleware/authMiddleware');

const csvUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

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
router.get('/export/pdf', protect, exportOrdersPDF);
router.get('/:id', protect, getOrderById);
router.post('/:id/pay', protect, payOrder);
router.post('/:id/verify', protect, verifyOrder);
router.get('/:id/receipt', protect, downloadReceipt);
router.put('/:id/status', protect, authorize('admin', 'staff'), updateOrderStatus);
router.post('/:id/cancel', protect, cancelOrder);
router.post('/bulk', protect, csvUpload.single('file'), bulkCreateOrder);
router.post('/agent', protect, authorize('agent'), createOrderForClient);

module.exports = router;
