const express = require('express');
const router = express.Router();
const { getBalance, getTransactions, topup } = require('../controllers/walletController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/balance', protect, getBalance);
router.get('/transactions', protect, getTransactions);
router.post('/topup', protect, topup);

module.exports = router;
