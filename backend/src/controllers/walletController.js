const { WalletTransaction, User, sequelize } = require('../models');
const { initiateSTKPush } = require('../utils/mpesa');

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
    const transactions = await WalletTransaction.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const topup = async (req, res) => {
  try {
    const { amount } = req.body;
    const phone = req.user.phone;
    const reference = `TOPUP-${Date.now()}`;

    // Create a pending transaction
    await WalletTransaction.create({
      user_id: req.user.id,
      transaction_type: 'deposit',
      amount,
      reference_id: reference,
      status: 'pending',
      notes: 'M-Pesa top-up'
    });

    const response = await initiateSTKPush(phone, amount, reference);
    res.json({ message: 'Top-up initiated', data: response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBalance,
  getTransactions,
  topup
};
