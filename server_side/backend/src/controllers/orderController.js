const { Order, OrderItem, Product, User, WalletTransaction, PickupStation, sequelize } = require('../models');
const { Op } = require('sequelize');
const mpesaService = require('../services/mpesaService');
const { generateQR } = require('../utils/qrGenerator');
const { generateOTP, verifyOTP } = require('../utils/otpGenerator');
const { generateReceipt } = require('../services/receiptService');
const { generateOrderHistoryPDF } = require('../services/pdfService');
const emailService = require('../services/emailService');
const whatsappService = require('../services/whatsappService');
const { v4: uuidv4 } = require('uuid');


const getBaseUrl = (req) => {
  if (req && req.get && req.get('host')) {
    return `${req.protocol}://${req.get('host')}`;
  }
  return process.env.FRONTEND_URL?.split(',')[0] || 'http://localhost:5173';
};

/**
 * Create a new order
 */
const createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, payment_method, delivery_channel, delivery_address, delivery_lat, delivery_lng, pickup_station_id } = req.body;
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

      const basePrice = parseFloat(req.user.tier === 'wholesale' ? product.wholesale_price : product.retail_price);
      // Accept AI-discounted price from cart if it is ≥ 50% of base (fraud floor)
      const requestedPrice = item.discountedPrice ? parseFloat(item.discountedPrice) : null;
      const price = (requestedPrice && requestedPrice >= basePrice * 0.5) ? requestedPrice : basePrice;
      const discountPercent = requestedPrice && price < basePrice ? Math.round((1 - price / basePrice) * 100) : 0;

      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product_id: product.id,
        quantity: item.quantity,
        unit_price: price,
        original_price: basePrice,
        discount_percent: discountPercent,
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

    if (delivery_channel === 'private_rider' && !delivery_address) {
      throw new Error('delivery_address is required for private rider delivery');
    }

    if (delivery_channel === 'pickup') {
      if (!pickup_station_id) {
        throw new Error('pickup_station_id is required for pickup delivery');
      }
      const station = await PickupStation.findOne({
        where: { id: pickup_station_id, is_active: true },
        transaction: t
      });
      if (!station) {
        throw new Error('Selected pickup station is invalid or inactive');
      }
    }

    if (req.user.tier === 'wholesale') {
      const pendingExposure = await Order.sum('total_amount', {
        where: {
          user_id: userId,
          status: ['pending', 'processing', 'dispatched']
        },
        transaction: t
      }) || 0;

      const allowedCredit = parseFloat(req.user.credit_limit || 0);
      if ((parseFloat(pendingExposure) + parseFloat(total_amount)) > allowedCredit) {
        throw new Error('Order exceeds your credit limit based on active wholesale orders');
      }
    }

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
      delivery_address: delivery_channel === 'private_rider' ? delivery_address : null,
      delivery_lat: delivery_channel === 'private_rider' ? delivery_lat || null : null,
      delivery_lng: delivery_channel === 'private_rider' ? delivery_lng || null : null,
      pickup_station_id: delivery_channel === 'pickup' ? pickup_station_id : null,
      // Temporary OTP (will be regenerated after payment)
      otp_code: Math.floor(100000 + Math.random() * 900000).toString(),
      otp_secret: uuidv4()
    }, { transaction: t });

    // Generate Payment QR for the order
    const qrCode = await generateQR(`${getBaseUrl(req)}/orders/${order.id}`);
    await order.update({ qr_code: qrCode }, { transaction: t });

    for (const item of orderItems) {
      await OrderItem.create({
        ...item,
        order_id: order.id
      }, { transaction: t });
    }

    await t.commit();

    // Broadcast new order to all staff/admin/agents in real-time
    const io = req.app.get('io');
    if (io) {
      io.to('admins').emit('newOrder', {
        id: order.id,
        orderNumber: order.order_number,
        totalAmount: order.total_amount,
        userId: userId,
        clientName: req.user.business_name || req.user.username,
        clientPhone: req.user.phone || '',
        agentId: req.user.agent_id || null,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: payment_method,
        deliveryChannel: delivery_channel,
        itemCount: orderItems.length,
        createdAt: new Date().toISOString()
      });
    }

    // Send instant notifications (non-blocking) — email + WhatsApp, fires for both pending and paid
    Order.findByPk(order.id, { include: [{ model: OrderItem, include: [Product] }] })
      .then(fullOrder => {
        if (!fullOrder) return;
        emailService.sendOrderPlacedNotification(req.user, fullOrder, fullOrder.OrderItems)
          .catch(err => console.error('Order placed email error:', err));
        whatsappService.sendOrderPlacedWhatsApp(req.user, fullOrder, fullOrder.OrderItems)
          .catch(err => console.error('Order placed WhatsApp error:', err));
      });

    res.status(201).json(order);
  } catch (error) {
    await t.rollback();
    console.error('Order creation error:', error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * Get all orders for the authenticated user
 * Supports optional status query param (single or comma-separated)
 */
const getOrders = async (req, res) => {
  try {
    let where = { user_id: req.user.id };

    if (['admin', 'staff'].includes(req.user.role)) {
      // Admin and staff see EVERY order across the platform by default,
      // or a specific customer's orders when ?userId= is provided.
      where = req.query.userId ? { user_id: req.query.userId } : {};
    } else if (req.user.role === 'agent' && req.query.userId) {
      // Agents can view a specific client's orders
      where = { user_id: req.query.userId };
    }

    // Handle status filter: ?status=pending,processing,dispatched
    if (req.query.status) {
      const statuses = req.query.status.split(',').map(s => s.trim());
      where.status = { [Op.in]: statuses };     // ✅ fixed: use Op.in instead of sequelize.Op.in
    }
    
    // For admin/staff, also include the buyer's details so they know whose order it is
    const include = [{ model: OrderItem, include: [Product] }];
    if (['admin', 'staff'].includes(req.user.role)) {
      include.push({ model: User, attributes: ['id', 'username', 'business_name', 'email', 'phone', 'tier'] });
    }

    const orders = await Order.findAll({
      where,
      include,
      order: [['createdAt', 'DESC']],
      limit: req.query.limit ? parseInt(req.query.limit) : undefined
    });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Export order history as PDF
 */
const exportOrdersPDF = async (req, res) => {
  try {
    let where = { user_id: req.user.id };
    if (['admin', 'staff'].includes(req.user.role) && req.query.userId) {
      where = { user_id: req.query.userId };
    }
    const orders = await Order.findAll({
      where,
      include: [{ model: OrderItem, include: [Product] }],
      order: [['createdAt', 'DESC']]
    });
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'username', 'business_name', 'email'] });
    const pdfStream = await generateOrderHistoryPDF(orders, user);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=order_history_${Date.now()}.pdf`);
    pdfStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a single order by ID
 */
const getOrderById = async (req, res) => {
  try {
    // Admin/staff can view any order; users can only see their own
    const where = ['admin', 'staff'].includes(req.user.role)
      ? { id: req.params.id }
      : { id: req.params.id, user_id: req.user.id };

    const order = await Order.findOne({
      where,
      include: [{ model: OrderItem, include: [Product] }, { model: PickupStation }]
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Regenerate both QRs fresh from the current host so they always point to
    // the live deployment (old orders had localhost baked into the stored image).
    const frontendUrl = getBaseUrl(req);
    const payment_qr = await generateQR(`${frontendUrl}/payment/${order.id}`);
    const qr_code = await generateQR(`${frontendUrl}/orders/${order.id}`);

    res.json({ ...order.toJSON(), payment_qr, qr_code });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get public unpaid order by ID for payment gateway
 * @route GET /api/orders/public/:id
 * @access Public
 */
const getPublicUnpaidOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        payment_status: 'pending'
      },
      attributes: ['id', 'order_number', 'total_amount', 'subtotal', 'tax', 'delivery_fee', 'payment_status', 'delivery_channel', 'createdAt'],
      include: [{ model: OrderItem, include: [Product] }, { model: PickupStation }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or already paid' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get public unpaid order error:', error);
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

    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.status === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    if (order.payment_method === 'mpesa') {
      const response = await mpesaService.initiateSTKPush(
        req.user.phone,
        order.total_amount,
        order.order_number
      );

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
        await user.update(
          { wallet_balance: user.wallet_balance - order.total_amount },
          { transaction: t }
        );

        await WalletTransaction.create({
          user_id: user.id,
          transaction_type: 'payment',
          amount: order.total_amount,
          reference_id: order.id,
          status: 'completed',
          notes: `Payment for order ${order.order_number}`
        }, { transaction: t });

        const { secret, otp } = generateOTP();
        const qrCode = await generateQR(`${getBaseUrl(req)}/orders/${order.id}`);

        await order.update({
          status: 'paid',
          payment_status: 'completed',
          otp_code: otp,
          otp_secret: secret,
          qr_code: qrCode
        }, { transaction: t });
      });

      const io = req.app.get('io');
      if (io) {
        io.to(order.user_id).emit('orderUpdate', {
          orderId: order.id,
          orderNumber: order.order_number,
          status: 'paid'
        });
      }

      // Send payment confirmation notifications (non-blocking)
      const freshOrder = await Order.findByPk(order.id);
      emailService.sendPaymentConfirmation(req.user, freshOrder, 'wallet')
        .catch(err => console.error('Payment email error:', err));
      whatsappService.sendPaymentConfirmedWhatsApp(req.user, freshOrder, 'wallet')
        .catch(err => console.error('Payment WhatsApp error:', err));

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
      console.log('Payment successful for order:', order.order_number);
      let mpesaReceipt = '';
      if (CallbackMetadata && CallbackMetadata.Item) {
        const receiptItem = CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber');
        mpesaReceipt = receiptItem ? receiptItem.Value : '';
      }

      const { secret, otp } = generateOTP();
      const qrCode = await generateQR(`${getBaseUrl(req)}/orders/${order.id}`);

      await order.update({
        status: 'paid',
        payment_status: 'completed',
        mpesa_code: mpesaReceipt,
        otp_code: otp,
        otp_secret: secret,
        qr_code: qrCode
      }, { transaction: t });

      await WalletTransaction.create({
        user_id: order.user_id,
        transaction_type: 'deposit',
        amount: order.total_amount,
        reference_id: order.id,
        mpesa_code: mpesaReceipt,
        status: 'completed',
        notes: `M-Pesa payment for order ${order.order_number}`
      }, { transaction: t });

      const io = req.app.get('io');
      if (io) {
        io.to(order.user_id).emit('orderUpdate', {
          orderId: order.id,
          orderNumber: order.order_number,
          status: 'paid'
        });
      }
    } else {
      console.log('Payment failed for order:', order.order_number, 'Reason:', ResultDesc);
      await order.update({ payment_status: 'failed' }, { transaction: t });
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

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'paid') return res.status(400).json({ message: 'Order is not paid yet' });
    if (order.status === 'completed') return res.status(400).json({ message: 'Order already verified' });

    const isValid = verifyOTP(order.otp_secret, otp);
    if (!isValid) return res.status(400).json({ message: 'Invalid OTP' });

    await order.update({ status: 'completed' });

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
 * Customer confirms they received their delivery (scanned via pickup/delivery QR).
 * Marks the order delivered and notifies admin + staff that the rider delivered it.
 * @route POST /api/orders/:id/confirm-delivery
 */
const confirmDelivery = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user_id !== req.user.id && !['admin', 'staff'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to confirm this delivery' });
    }
    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'This order is already marked as delivered' });
    }
    if (!['dispatched', 'ready', 'processing'].includes(order.status)) {
      return res.status(400).json({ message: `Order cannot be confirmed delivered from status "${order.status}"` });
    }

    await order.update({ status: 'delivered' });

    const io = req.app.get('io');
    if (io) {
      io.to(order.user_id).emit('orderUpdate', {
        orderId: order.id, orderNumber: order.order_number, status: 'delivered'
      });
      io.to('admins').emit('deliveryConfirmed', {
        orderId: order.id,
        orderNumber: order.order_number,
        message: `Order #${order.order_number} confirmed delivered by the customer.`,
        confirmedAt: new Date()
      });
      io.to('admins').emit('notification', {
        type: 'delivery',
        message: `✅ Order #${order.order_number} delivered successfully (confirmed by customer).`
      });
    }

    res.json({ message: 'Delivery confirmed — thank you!', order });
  } catch (error) {
    console.error('Confirm delivery error:', error);
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

    if (!order) return res.status(404).json({ message: 'Order not found' });
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
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const { status } = req.body;
    await order.update({ status });

    // Send status update notifications (email + WhatsApp)
    const user = await User.findByPk(order.user_id);
    if (user) {
      emailService.sendOrderStatusUpdate(user, order).catch(err => console.error('Status email error:', err));
      whatsappService.sendOrderStatusWhatsApp(user, order).catch(err => console.error('Status WhatsApp error:', err));
    }

    const io = req.app.get('io');
    if (io) {
      io.to(order.user_id).emit('orderUpdate', {
        orderId: order.id,
        orderNumber: order.order_number,
        status: status
      });
    }

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

/**
 * Create order for a client (Agent feature)
 */
const createOrderForClient = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { client_id, items, payment_method, delivery_channel, delivery_address, delivery_lat, delivery_lng, pickup_station_id } = req.body;
    const agentId = req.user.id;

    const client = await User.findByPk(client_id, { transaction: t });
    if (!client) throw new Error('Client not found');

    const agent = await User.findByPk(agentId, { transaction: t });

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction: t });
      if (!product) throw new Error(`Product ${item.product_id} not found`);
      if (product.current_stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);

      const price = client.tier === 'wholesale' ? product.wholesale_price : product.retail_price;
      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product_id: product.id,
        quantity: item.quantity,
        unit_price: price,
        subtotal: itemSubtotal
      });

      await product.update(
        { current_stock: product.current_stock - item.quantity },
        { transaction: t }
      );
    }

    const tax = subtotal * 0.16;
    const delivery_fee = delivery_channel === 'pickup' ? 0 : 250;
    const total_amount = subtotal + tax + delivery_fee;

    // Calculate agent commission
    const commission_earned = (subtotal * (agent.commission_rate || 5)) / 100;

    const order = await Order.create({
      order_number: `BLA-${Date.now()}`,
      user_id: client_id,
      agent_id: agentId,
      commission_earned,
      status: 'pending',
      order_type: client.tier,
      subtotal,
      tax,
      delivery_fee,
      total_amount,
      payment_method,
      payment_status: 'pending',
      delivery_channel,
      delivery_address: delivery_channel === 'private_rider' ? delivery_address : null,
      delivery_lat: delivery_channel === 'private_rider' ? delivery_lat || null : null,
      delivery_lng: delivery_channel === 'private_rider' ? delivery_lng || null : null,
      pickup_station_id: delivery_channel === 'pickup' ? pickup_station_id : null,
      otp_code: Math.floor(100000 + Math.random() * 900000).toString(),
      otp_secret: uuidv4()
    }, { transaction: t });

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
    console.error('Agent order creation error:', error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * Bulk order creation via CSV upload
 * Expected CSV: product_id,quantity  (header row required)
 */
const bulkCreateOrder = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'CSV file is required' });
  }

  const t = await sequelize.transaction();
  try {
    const csvText = req.file.buffer.toString('utf8');
    const lines = csvText.split(/\r?\n/).filter(l => l.trim());

    // Skip header row
    const dataLines = lines[0].toLowerCase().startsWith('product_id') ? lines.slice(1) : lines;

    if (dataLines.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'CSV has no data rows' });
    }

    const parsedItems = [];
    for (const line of dataLines) {
      const cols = line.split(',').map(c => c.trim());
      const product_id = cols[0];
      const quantity = parseInt(cols[1]);
      if (!product_id || isNaN(quantity) || quantity <= 0) continue;
      parsedItems.push({ product_id, quantity });
    }

    if (parsedItems.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'No valid rows in CSV. Expected: product_id,quantity' });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of parsedItems) {
      const product = await Product.findByPk(item.product_id, { transaction: t });
      if (!product) throw new Error(`Product ID ${item.product_id} not found`);
      if (product.current_stock < item.quantity) {
        throw new Error(`Insufficient stock for "${product.name}" (available: ${product.current_stock})`);
      }

      const price = req.user.tier === 'wholesale' ? product.wholesale_price : product.retail_price;
      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({ product_id: product.id, quantity: item.quantity, unit_price: price, subtotal: itemSubtotal });
      await product.update({ current_stock: product.current_stock - item.quantity }, { transaction: t });
    }

    const tax = subtotal * 0.16;
    const total_amount = subtotal + tax;

    const order = await Order.create({
      order_number: `BLB-${Date.now()}`,
      user_id: req.user.id,
      status: 'pending',
      order_type: req.user.tier,
      subtotal,
      tax,
      delivery_fee: 0,
      total_amount,
      payment_method: 'wallet',
      payment_status: 'pending',
      delivery_channel: 'pickup',
      otp_code: Math.floor(100000 + Math.random() * 900000).toString(),
      otp_secret: uuidv4()
    }, { transaction: t });

    for (const item of orderItems) {
      await OrderItem.create({ ...item, order_id: order.id }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({
      message: `Bulk order created with ${orderItems.length} product(s)`,
      order: { id: order.id, order_number: order.order_number, total_amount: order.total_amount }
    });
  } catch (error) {
    await t.rollback();
    console.error('Bulk order error:', error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * Cancel a pending order – restores stock and refunds wallet if paid
 */
const cancelOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findOne({
      where: { id: req.params.id },
      include: [{ model: OrderItem, include: [Product] }],
      transaction: t
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ message: 'Order not found' });
    }

    const isOwner = order.user_id === req.user.id;
    const isAdminOrStaff = ['admin', 'staff'].includes(req.user.role);
    if (!isOwner && !isAdminOrStaff) {
      await t.rollback();
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!['pending', 'paid'].includes(order.status)) {
      await t.rollback();
      return res.status(400).json({ message: `Cannot cancel an order with status "${order.status}"` });
    }

    // Restore stock
    for (const item of order.OrderItems) {
      await item.Product.update(
        { current_stock: item.Product.current_stock + item.quantity },
        { transaction: t }
      );
    }

    // Refund wallet if order was paid via wallet
    if (order.payment_status === 'completed' && order.payment_method === 'wallet') {
      const user = await User.findByPk(order.user_id, { transaction: t });
      await user.update({ wallet_balance: parseFloat(user.wallet_balance) + parseFloat(order.total_amount) }, { transaction: t });
      await WalletTransaction.create({
        user_id: order.user_id,
        transaction_type: 'deposit',
        amount: order.total_amount,
        reference_id: order.id,
        status: 'completed',
        notes: `Refund for cancelled order ${order.order_number}`
      }, { transaction: t });
    }

    await order.update({ status: 'cancelled', payment_status: 'failed' }, { transaction: t });

    const io = req.app.get('io');
    if (io) {
      io.to(order.user_id).emit('orderUpdate', {
        orderId: order.id,
        orderNumber: order.order_number,
        status: 'cancelled'
      });
    }

    await t.commit();
    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    await t.rollback();
    console.error('Cancel order error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  getPublicUnpaidOrder,
  payOrder,
  handleMpesaCallback,
  verifyOrder,
  confirmDelivery,
  downloadReceipt,
  updateOrderStatus,
  createOrderForClient,
  bulkCreateOrder,
  cancelOrder,
  exportOrdersPDF
};