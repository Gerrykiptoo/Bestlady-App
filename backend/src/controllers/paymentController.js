const { initiateSTKPush } = require('../services/mpesaService');
const { Order, WalletTransaction, sequelize } = require('../models');

const initiatePayment = async (req, res) => {
  try {
    const { amount, phone, orderId } = req.body;
    const response = await initiateSTKPush(phone, amount, orderId);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const mpesaCallback = async (req, res) => {
  // Logic for handling M-Pesa callback
  console.log('M-Pesa Callback received:', req.body);
  res.json({ ResultCode: 0, ResultDesc: 'Success' });
};

module.exports = {
  initiatePayment,
  mpesaCallback
};
