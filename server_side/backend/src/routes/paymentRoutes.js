const express = require('express');
const router = express.Router();
const { initiatePayment, mpesaCallback, walletTopupCallback, queryPaymentStatus } = require('../controllers/paymentController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/payment/stkpush
 * @desc    Initiate M-Pesa STK Push
 * @access  Private (requires authentication)
 */
router.post('/stkpush', optionalProtect, initiatePayment);

/**
 * @route   GET /api/payment/status/:checkoutRequestID
 * @desc    Check payment status after STK push
 * @access  Private (requires authentication)
 */
router.get('/status/:checkoutRequestID', protect, queryPaymentStatus);

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
