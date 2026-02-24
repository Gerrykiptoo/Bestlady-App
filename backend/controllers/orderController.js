const { Order, OrderItem, Product, User, sequelize } = require('../models');
const { initiateSTKPush } = require('../utils/mpesa');
const { v4: uuidv4 } = require('uuid');

const createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, payment_method, delivery_channel } = req.body;
    const userId = req.user.id;

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
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

      // Update stock
      await product.update({ current_stock: product.current_stock - item.quantity }, { transaction: t });
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
    res.status(400).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{ model: OrderItem, include: [Product] }]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const { status } = req.body;
    await order.update({ status });

    // AI Logistics Agent logic
    if (status === 'paid' && order.delivery_channel !== 'pickup') {
      const logistics_provider = order.total_amount < 5000 ? 'Private Rider' : 'Company Fleet';
      // In a real system, we'd trigger a logistics task here
      console.log(`Order ${order.order_number} assigned to ${logistics_provider}`);
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const payOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.payment_method === 'mpesa') {
      const response = await initiateSTKPush(req.user.phone, order.total_amount, order.order_number);
      res.json({ message: 'STK Push initiated', data: response });
    } else if (order.payment_method === 'wallet') {
      const user = await User.findByPk(req.user.id);
      if (user.wallet_balance < order.total_amount) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }

      await sequelize.transaction(async (t) => {
        await user.update({ wallet_balance: user.wallet_balance - order.total_amount }, { transaction: t });
        await order.update({ payment_status: 'paid', status: 'paid' }, { transaction: t });
      });

      res.json({ message: 'Payment successful via wallet' });
    } else {
      res.status(400).json({ message: 'Unsupported payment method' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  payOrder
};
