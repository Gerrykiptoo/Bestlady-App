const express = require('express');
const router = express.Router();
const { initiatePayment, mpesaCallback } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/stkpush', protect, initiatePayment);
router.post('/callback', mpesaCallback);

module.exports = router;
