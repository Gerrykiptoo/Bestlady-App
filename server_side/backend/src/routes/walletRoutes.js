const express = require('express');
const router = express.Router();
const { getBalance, getTransactions, topup, exportTransactionsPDF } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

router.get('/balance', protect, getBalance);
router.get('/transactions', protect, getTransactions);
router.post('/topup', protect, topup);
router.get('/export/pdf', protect, exportTransactionsPDF);

module.exports = router;
