const { initiateSTKPush } = require('../services/mpesaService');
const { Order, WalletTransaction, User, sequelize } = require('../models');
const { generateOTP } = require('../utils/otpGenerator');
const { generateQR } = require('../utils/qrGenerator');
const emailService = require('../services/emailService');
const whatsappService = require('../services/whatsappService');

/**
 * Initiate M-Pesa STK Push payment
 * @route POST /api/payment/stkpush
 * @access Private
 */
const initiatePayment = async (req, res) => {
  try {
    const { amount, phone, orderId } = req.body;

    // Validate required fields
    if (!amount || !phone || !orderId) {
      return res.status(400).json({ 
        message: 'Missing required fields: amount, phone, and orderId are required' 
      });
    }

    // Check if order exists and belongs to user
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify order belongs to authenticated user
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }

    // Check if order is already paid
    if (order.status === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    // Verify amount matches order total
    if (parseFloat(amount) !== parseFloat(order.total_amount)) {
      return res.status(400).json({ 
        message: 'Payment amount does not match order total',
        expected: order.total_amount,
        received: amount
      });
    }

    // Format phone number (remove any non-digits and ensure 254 format)
    let formattedPhone = phone.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith('7')) {
      formattedPhone = '254' + formattedPhone;
    } else if (!formattedPhone.startsWith('254')) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Initiate STK Push
    const response = await initiateSTKPush(
      formattedPhone, 
      amount, 
      order.order_number.slice(0, 12) // M-Pesa limits to 12 chars
    );

    // Store CheckoutRequestID in order for callback verification
    await order.update({
      mpesa_code: response.CheckoutRequestID,
      payment_status: 'processing'
    });

    res.json({
      success: true,
      message: 'STK Push sent. Please check your phone and enter PIN.',
      data: {
        checkoutRequestID: response.CheckoutRequestID,
        merchantRequestID: response.MerchantRequestID,
        responseCode: response.ResponseCode,
        responseDescription: response.ResponseDescription
      }
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to initiate payment'
    });
  }
};

/**
 * M-Pesa callback webhook
 * @route POST /api/payment/callback
 * @access Public (called by Safaricom)
 */
const mpesaCallback = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    console.log('📞 M-Pesa Callback received:', JSON.stringify(req.body, null, 2));

    const { Body } = req.body;
    
    if (!Body || !Body.stkCallback) {
      await t.rollback();
      return res.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid callback data' });
    }

    const { stkCallback } = Body;
    const { 
      CheckoutRequestID, 
      ResultCode, 
      ResultDesc,
      CallbackMetadata 
    } = stkCallback;

    // Find order by CheckoutRequestID
    const order = await Order.findOne({ 
      where: { mpesa_code: CheckoutRequestID },
      transaction: t
    });

    if (!order) {
      console.error('❌ Order not found for CheckoutRequestID:', CheckoutRequestID);
      await t.rollback();
      return res.json({ ResultCode: 1, ResultDesc: 'Order not found' });
    }

    if (ResultCode === 0) {
      // Payment successful
      console.log('✅ Payment successful for order:', order.order_number);

      // Extract payment details from callback metadata
      let mpesaReceipt = '', amount = 0, phone = '', transactionDate = '';
      
      if (CallbackMetadata && CallbackMetadata.Item) {
        CallbackMetadata.Item.forEach(item => {
          switch(item.Name) {
            case 'MpesaReceiptNumber':
              mpesaReceipt = item.Value;
              break;
            case 'Amount':
              amount = item.Value;
              break;
            case 'PhoneNumber':
              phone = item.Value;
              break;
            case 'TransactionDate':
              transactionDate = item.Value;
              break;
          }
        });
      }

      // Generate OTP and QR code (encodes order URL for easy customer scanning)
      const { secret, otp } = generateOTP();
      const qrCode = await generateQR(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${order.id}`);

      // Update order with payment details
      await order.update({
        status: 'paid',
        payment_status: 'completed',
        mpesa_code: mpesaReceipt || CheckoutRequestID,
        otp_code: otp,
        otp_secret: secret,
        qr_code: qrCode
      }, { transaction: t });

      // Record transaction in wallet history (for tracking)
      await WalletTransaction.create({
        user_id: order.user_id,
        transaction_type: 'deposit',
        amount: amount || order.total_amount,
        reference_id: order.id,
        mpesa_code: mpesaReceipt,
        status: 'completed',
        notes: `M-Pesa payment for order ${order.order_number}`
      }, { transaction: t });

      // Get updated user with wallet balance
      const user = await User.findByPk(order.user_id, { transaction: t });

      // Emit socket event for real-time notification
      const io = req.app.get('io');
      if (io) {
        io.to(order.user_id).emit('orderUpdate', {
          orderId: order.id,
          orderNumber: order.order_number,
          status: 'paid',
          message: 'Payment received successfully!'
        });
        
        // Emit wallet balance update
        io.to(order.user_id).emit('walletUpdate', {
          balance: user.wallet_balance,
          transaction: {
            type: 'payment',
            amount: amount || order.total_amount,
            reference: order.order_number
          }
        });
      }

      console.log(`✅ Order ${order.order_number} updated successfully`);

      // Send payment confirmation notifications (non-blocking)
      const updatedOrder = await Order.findByPk(order.id, { transaction: t });
      emailService.sendPaymentConfirmation(user, updatedOrder, 'mpesa')
        .catch(err => console.error('M-Pesa payment email error:', err));
      whatsappService.sendPaymentConfirmedWhatsApp(user, updatedOrder, 'mpesa')
        .catch(err => console.error('M-Pesa payment WhatsApp error:', err));

    } else {
      // Payment failed
      console.log(`❌ Payment failed for order ${order.order_number}: ${ResultDesc}`);

      await order.update({
        payment_status: 'failed'
      }, { transaction: t });
    }

    await t.commit();

    // Always respond with success to M-Pesa
    res.json({ 
      ResultCode: 0, 
      ResultDesc: 'Success' 
    });

  } catch (error) {
    await t.rollback();
    console.error('❌ Callback processing error:', error);
    res.status(500).json({ 
      ResultCode: 1, 
      ResultDesc: 'Error processing callback: ' + error.message 
    });
  }
};

/**
 * Query payment status
 * @route GET /api/payment/status/:checkoutRequestID
 * @access Private
 */
const queryPaymentStatus = async (req, res) => {
  try {
    const { checkoutRequestID } = req.params;
    
    // You can add a method in mpesaService to query status
    // const result = await querySTKStatus(checkoutRequestID);
    
    // For now, check if order exists with that mpesa_code
    const order = await Order.findOne({ 
      where: { mpesa_code: checkoutRequestID },
      attributes: ['id', 'order_number', 'status', 'payment_status', 'mpesa_code']
    });

    if (!order) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({
      checkoutRequestID,
      status: order.payment_status,
      orderStatus: order.status,
      orderNumber: order.order_number
    });

  } catch (error) {
    console.error('Status query error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Wallet topup callback webhook
 * @route POST /api/payment/wallet-callback
 * @access Public (called by Safaricom)
 */
const walletTopupCallback = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    console.log('📞 Wallet Topup Callback received:', JSON.stringify(req.body, null, 2));

    const { Body } = req.body;
    
    if (!Body || !Body.stkCallback) {
      await t.rollback();
      return res.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid callback data' });
    }

    const { stkCallback } = Body;
    const { 
      CheckoutRequestID, 
      ResultCode, 
      ResultDesc,
      CallbackMetadata 
    } = stkCallback;

    // Find wallet transaction by reference
    const walletTx = await WalletTransaction.findOne({ 
      where: { reference_id: CheckoutRequestID },
      transaction: t
    });

    if (!walletTx) {
      console.error('❌ Wallet transaction not found for CheckoutRequestID:', CheckoutRequestID);
      await t.rollback();
      return res.json({ ResultCode: 1, ResultDesc: 'Transaction not found' });
    }

    if (ResultCode === 0) {
      // Topup successful
      console.log('✅ Wallet topup successful');

      // Extract payment details
      let mpesaReceipt = '', amount = 0;
      
      if (CallbackMetadata && CallbackMetadata.Item) {
        CallbackMetadata.Item.forEach(item => {
          if (item.Name === 'MpesaReceiptNumber') mpesaReceipt = item.Value;
          if (item.Name === 'Amount') amount = item.Value;
        });
      }

      // Update wallet transaction
      await walletTx.update({
        status: 'completed',
        mpesa_code: mpesaReceipt || CheckoutRequestID
      }, { transaction: t });

      // Update user wallet balance
      const user = await User.findByPk(walletTx.user_id, { transaction: t });
      await user.update({
        wallet_balance: parseFloat(user.wallet_balance) + parseFloat(amount || walletTx.amount)
      }, { transaction: t });

      // Emit socket event for real-time wallet update
      const io = req.app.get('io');
      if (io) {
        io.to(walletTx.user_id).emit('walletUpdate', {
          balance: user.wallet_balance,
          transaction: {
            type: 'topup',
            amount: amount || walletTx.amount,
            reference: mpesaReceipt,
            status: 'completed'
          },
          message: `Wallet topped up with KES ${amount || walletTx.amount}`
        });
      }

      console.log(`✅ Wallet topup completed for user ${walletTx.user_id}`);

    } else {
      // Topup failed
      console.log(`❌ Wallet topup failed: ${ResultDesc}`);
      await walletTx.update({
        status: 'failed'
      }, { transaction: t });
    }

    await t.commit();
    res.json({ ResultCode: 0, ResultDesc: 'Success' });

  } catch (error) {
    await t.rollback();
    console.error('❌ Wallet callback processing error:', error);
    res.status(500).json({ 
      ResultCode: 1, 
      ResultDesc: 'Error processing callback: ' + error.message 
    });
  }
};

module.exports = {
  initiatePayment,
  mpesaCallback,
  queryPaymentStatus,
  walletTopupCallback
};