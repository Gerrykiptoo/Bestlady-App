const { WalletTransaction, User, sequelize } = require('../models');
const { initiateSTKPush } = require('../services/mpesaService');
const { generateWalletTransactionsPDF } = require('../services/pdfService');

const getBalance = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['wallet_balance']
    });
    res.json({ balance: user.wallet_balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const targetUserId = (req.user.role === 'admin' && req.query.userId)
      ? req.query.userId
      : req.user.id;

    const transactions = await WalletTransaction.findAll({
      where: { user_id: targetUserId },
      order: [['createdAt', 'DESC']],
      limit: req.query.limit ? parseInt(req.query.limit) : undefined
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const topup = async (req, res) => {
  try {
    const { amount, phone: customPhone } = req.body;
    if (!amount || parseFloat(amount) < 1) {
      return res.status(400).json({ message: 'Amount must be at least KES 1' });
    }
    const phone = customPhone || req.user.phone;
    const reference = `TOPUP-${Date.now()}`;
    const walletCallbackUrl = process.env.MPESA_WALLET_CALLBACK_URL || process.env.MPESA_CALLBACK_URL;

    await WalletTransaction.create({
      user_id: req.user.id,
      transaction_type: 'deposit',
      amount,
      reference_id: reference,
      status: 'pending',
      notes: 'M-Pesa top-up'
    });

    const response = await initiateSTKPush(phone, amount, reference, walletCallbackUrl);
    const user = await User.findByPk(req.user.id);
    res.json({
      message: 'Top-up initiated. Check your phone for the M-Pesa PIN prompt.',
      data: response,
      currentBalance: user.wallet_balance,
      pendingAmount: amount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const exportTransactionsPDF = async (req, res) => {
  try {
    const targetUserId = (req.user.role === 'admin' && req.query.userId)
      ? req.query.userId
      : req.user.id;

    const transactions = await WalletTransaction.findAll({
      where: { user_id: targetUserId },
      order: [['createdAt', 'DESC']]
    });
    const user = await User.findByPk(targetUserId, { attributes: ['id', 'username', 'business_name', 'email'] });
    const pdfStream = await generateWalletTransactionsPDF(transactions, user);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=wallet_transactions_${Date.now()}.pdf`);
    pdfStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBalance,
  getTransactions,
  topup,
  exportTransactionsPDF
};
