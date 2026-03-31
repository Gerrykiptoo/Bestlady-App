const { Order, OrderItem, Product, User, WalletTransaction, sequelize } = require('../models');
const mpesaService = require('../services/mpesaService');
const { generateQR } = require('../utils/qrGenerator');
const { generateOTP, verifyOTP } = require('../utils/otpGenerator');
const { generateReceipt } = require('../services/receiptService');
const { v4: uuidv4 } = require('uuid');

/**
 * Create a new order
 */
const createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, payment_method, delivery_channel } = req.body;
    const userId = req.user.id;

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction: t });
      if (!product) {
        throw new Error(`Product ${item.product_id} not found`);
      }
      if (product.current_stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const price = req.user.tier === 'wholesale' ? product.wholesale_price : product.retail_price;
      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product_id: product.id,
        quantity: item.quantity,
        unit_price: price,
        subtotal: itemSubtotal
      });

      // Reserve stock (will be permanently deducted after payment)
      await product.update(
        { current_stock: product.current_stock - item.quantity },
        { transaction: t }
      );
    }

    const tax = subtotal * 0.16; // 16% VAT
    const delivery_fee = delivery_channel === 'pickup' ? 0 : 250;
    const total_amount = subtotal + tax + delivery_fee;

    const order = await Order.create({
      order_number: `BL-${Date.now()}`,
      user_id: userId,
      status: 'pending',
      order_type: req.user.tier,
      subtotal,
      tax,
      delivery_fee,
      total_amount,
      payment_method,
      payment_status: 'pending',
      delivery_channel,
      // Temporary OTP (will be regenerated after payment)
      otp_code: Math.floor(100000 + Math.random() * 900000).toString(),
      otp_secret: uuidv4()
    }, { transaction: t });

    // Generate Payment QR for the order
    // Fetch full order with items for QR
    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, include: [Product] }],
      transaction: t
    });
    const qrData = JSON.stringify({
      orderId: order.id,
      orderNumber: order.order_number,
      paymentStatus: 'pending',
      totalAmount: order.total_amount,
      items: fullOrder.OrderItems.map(item => ({
        name: item.Product.name,
        quantity: item.quantity,
        price: item.unit_price,
        subtotal: item.subtotal
      })),
      customer: req.user.username || 'Customer',
      date: new Date().toISOString(),
      payNowUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${order.id}/pay`
    });
    const qrCode = await generateQR(qrData);
    await order.update({ qr_code: qrCode }, { transaction: t });

    for (const item of orderItems) {
      await OrderItem.create({
        ...item,
        order_id: order.id
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json(order);
  } catch (error) {
    await t.rollback();
    console.error('Order creation error:', error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * Get all orders for the authenticated user
 */
const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{ model: OrderItem, include: [Product] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a single order by ID
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{ model: OrderItem, include: [Product] }]
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Pay for an order (wallet or M-Pesa)
 */
const payOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if already paid
    if (order.status === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    if (order.payment_method === 'mpesa') {
      // Use mpesaService to initiate STK push
      const response = await mpesaService.initiateSTKPush(
        req.user.phone,
        order.total_amount,
        order.order_number
      );

      // Store CheckoutRequestID in order for callback verification
      await order.update({
        mpesa_code: response.CheckoutRequestID,
        payment_status: 'processing'
      });

      res.json({ 
        message: 'STK Push initiated. Please check your phone and enter PIN.',
        data: {
          checkoutRequestID: response.CheckoutRequestID,
          merchantRequestID: response.MerchantRequestID
        }
      });

    } else if (order.payment_method === 'wallet') {
      const user = await User.findByPk(req.user.id);
      if (user.wallet_balance < order.total_amount) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }

      await sequelize.transaction(async (t) => {
        // Deduct from wallet
        await user.update(
          { wallet_balance: user.wallet_balance - order.total_amount },
          { transaction: t }
        );

        // Record wallet transaction
        await WalletTransaction.create({
          user_id: user.id,
          transaction_type: 'payment',
          amount: order.total_amount,
          reference_id: order.id,
          status: 'completed',
          notes: `Payment for order ${order.order_number}`
        }, { transaction: t });

        // Generate OTP and QR for pickup
        const { secret, otp } = generateOTP();
        // Full order details for QR
        const fullOrder = await Order.findByPk(order.id, {
          include: [{ model: OrderItem, include: [Product] }],
          transaction: t
        });
        const qrData = JSON.stringify({
          orderId: order.id,
          orderNumber: order.order_number,
          paymentStatus: 'paid',
          totalAmount: order.total_amount,
          items: fullOrder.OrderItems.map(item => ({
            name: item.Product.name,
            quantity: item.quantity,
            price: item.unit_price,
            subtotal: item.subtotal
          })),
          customer: req.user.username || 'Customer',
          date: new Date().toISOString(),
          otp: otp,
          payNowUrl: null // Already paid
        });
        const qrCode = await generateQR(qrData);

        // Update order
        await order.update({
          status: 'paid',
          payment_status: 'completed',
          otp_code: otp,
          otp_secret: secret,
          qr_code: qrCode
        }, { transaction: t });
      });

      // Emit socket notification
      const io = req.app.get('io');
      if (io) {
        io.to(order.user_id).emit('orderUpdate', {
          orderId: order.id,
          orderNumber: order.order_number,
          status: 'paid'
        });
      }

      res.json({ 
        message: 'Payment successful via wallet',
        order: {
          id: order.id,
          order_number: order.order_number,
          status: 'paid',
          qr_code: order.qr_code,
          otp_code: order.otp_code
        }
      });
    } else {
      res.status(400).json({ message: 'Unsupported payment method' });
    }
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Handle M-Pesa callback (webhook)
 * This is called by Safaricom after payment processing
 */
const handleMpesaCallback = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    console.log('M-Pesa Callback received:', JSON.stringify(req.body, null, 2));

    const { Body } = req.body;
    if (!Body || !Body.stkCallback) {
      await t.rollback();
      return res.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid callback data' });
    }

    const { stkCallback } = Body;
    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    // Find order by CheckoutRequestID
    const order = await Order.findOne({ 
      where: { mpesa_code: CheckoutRequestID },
      transaction: t
    });

    if (!order) {
      console.error('Order not found for CheckoutRequestID:', CheckoutRequestID);
      await t.rollback();
      return res.json({ ResultCode: 1, ResultDesc: 'Order not found' });
    }

    if (ResultCode === 0) {
      // Payment successful
      console.log('Payment successful for order:', order.order_number);

      // Extract M-Pesa receipt number
      let mpesaReceipt = '';
      if (CallbackMetadata && CallbackMetadata.Item) {
        const receiptItem = CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber');
        mpesaReceipt = receiptItem ? receiptItem.Value : '';
      }

      // Generate OTP and QR code for pickup
      const { secret, otp } = generateOTP();
      // Full order details for QR
      const fullOrder = await Order.findByPk(order.id, {
        include: [{ model: OrderItem, include: [Product] }],
        transaction: t
      });
      const qrData = JSON.stringify({
        orderId: order.id,
        orderNumber: order.order_number,
        paymentStatus: 'completed',
        totalAmount: order.total_amount,
        items: fullOrder.OrderItems.map(item => ({
          name: item.Product.name,
          quantity: item.quantity,
          price: item.unit_price,
          subtotal: item.subtotal
        })),
        customer: req.user.username || 'Customer',
        date: new Date().toISOString(),
        otp: otp,
        payNowUrl: null
      });
      const qrCode = await generateQR(qrData);

      // Update order
      await order.update({
        status: 'paid',
        payment_status: 'completed',
        mpesa_code: mpesaReceipt,
        otp_code: otp,
        otp_secret: secret,
        qr_code: qrCode
      }, { transaction: t });

      // Record wallet transaction (optional - for tracking)
      await WalletTransaction.create({
        user_id: order.user_id,
        transaction_type: 'deposit',
        amount: order.total_amount,
        reference_id: order.id,
        mpesa_code: mpesaReceipt,
        status: 'completed',
        notes: `M-Pesa payment for order ${order.order_number}`
      }, { transaction: t });

      // Emit socket notification
      const io = req.app.get('io');
      if (io) {
        io.to(order.user_id).emit('orderUpdate', {
          orderId: order.id,
          orderNumber: order.order_number,
          status: 'paid'
        });
      }

    } else {
      // Payment failed
      console.log('Payment failed for order:', order.order_number, 'Reason:', ResultDesc);
      await order.update({
        payment_status: 'failed'
      }, { transaction: t });
    }

    await t.commit();
    res.json({ ResultCode: 0, ResultDesc: 'Success' });

  } catch (error) {
    await t.rollback();
    console.error('Callback processing error:', error);
    res.json({ ResultCode: 1, ResultDesc: 'Error processing callback' });
  }
};

/**
 * Verify order pickup with OTP
 */
const verifyOrder = async (req, res) => {
  try {
    const { otp } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order is paid
    if (order.status !== 'paid') {
      return res.status(400).json({ message: 'Order is not paid yet' });
    }

    // Check if already verified
    if (order.status === 'completed') {
      return res.status(400).json({ message: 'Order already verified' });
    }

    // Verify OTP
    const isValid = verifyOTP(order.otp_secret, otp);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Update order status
    await order.update({ status: 'completed' });

    // Emit socket notification
    const io = req.app.get('io');
    if (io) {
      io.to(order.user_id).emit('orderUpdate', {
        orderId: order.id,
        orderNumber: order.order_number,
        status: 'completed'
      });
    }

    res.json({ message: 'Order verified successfully', order });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Download order receipt as PDF
 */
const downloadReceipt = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, include: [Product] }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findByPk(order.user_id);
    const pdfStream = await generateReceipt(order, user, order.OrderItems);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${order.order_number}.pdf`);
    pdfStream.pipe(res);

  } catch (error) {
    console.error('Receipt generation error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update order status (admin only)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const { status } = req.body;
    await order.update({ status });

    // Emit Socket.io notification to the user
    const io = req.app.get('io');
    if (io) {
      io.to(order.user_id).emit('orderUpdate', {
        orderId: order.id,
        orderNumber: order.order_number,
        status: status
      });
    }

    // AI Logistics Agent logic
    if (status === 'paid' && order.delivery_channel !== 'pickup') {
      const logistics_provider = order.total_amount < 5000 ? 'Private Rider' : 'Company Fleet';
      console.log(`Order ${order.order_number} assigned to ${logistics_provider}`);
    }

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ EXPORT ALL FUNCTIONS
module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  payOrder,
  handleMpesaCallback,
  verifyOrder,
  downloadReceipt,
  updateOrderStatus
};
