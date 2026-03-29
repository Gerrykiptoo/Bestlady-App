const express = require('express');
const router = express.Router();
const { initiatePayment, mpesaCallback, walletTopupCallback } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/payment/stkpush
 * @desc    Initiate M-Pesa STK Push
 * @access  Private (requires authentication)
 */
router.post('/stkpush', protect, initiatePayment);

/**
 * @route   POST /api/payment/callback
 * @desc    M-Pesa callback URL (webhook)
 * @access  Public (M-Pesa calls this)
 */
router.post('/callback', mpesaCallback);

/**
 * @route   POST /api/payment/wallet-callback
 * @desc    M-Pesa wallet topup callback URL (webhook)
 * @access  Public (M-Pesa calls this)
 */
router.post('/wallet-callback', walletTopupCallback);

module.exports = router;
