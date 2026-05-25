const { Order, OrderItem, Product, User, sequelize } = require('../models');
const { Op } = require('sequelize');

const orderInclude = [
  {
    model: User,
    attributes: ['id', 'username', 'business_name', 'phone', 'email', 'tier']
  },
  {
    model: OrderItem,
    include: [{ model: Product, attributes: ['id', 'name', 'image_url'] }]
  }
];

/**
 * GET /api/staff/stats
 * Returns counts, paid/unpaid order queues, recent orders, and low-stock items
 */
const getStaffStats = async (req, res) => {
  try {
    const [
      pendingOrders,
      paidOrders,
      processingOrders,
      readyOrders,
      paidQueue,
      unpaidQueue,
      recentOrders,
      lowStock
    ] = await Promise.all([
      Order.count({ where: { status: 'pending', payment_status: 'pending' } }),
      Order.count({ where: { status: 'paid' } }),
      Order.count({ where: { status: 'processing' } }),
      Order.count({ where: { status: 'ready' } }),

      // Paid — needs packing: status = paid or processing with completed payment
      Order.findAll({
        where: {
          payment_status: 'completed',
          status: { [Op.in]: ['paid', 'processing'] }
        },
        include: orderInclude,
        order: [['createdAt', 'DESC']],
        limit: 30
      }),

      // Unpaid — awaiting payment
      Order.findAll({
        where: { status: 'pending', payment_status: 'pending' },
        include: orderInclude,
        order: [['createdAt', 'DESC']],
        limit: 30
      }),

      // Recent activity (all statuses)
      Order.findAll({
        include: orderInclude,
        order: [['createdAt', 'DESC']],
        limit: 20
      }),

      // Low stock
      Product.findAll({
        where: { current_stock: { [Op.lt]: 10 }, is_active: true },
        attributes: ['id', 'name', 'current_stock', 'unit', 'image_url'],
        limit: 10
      })
    ]);

    res.json({
      counts: { pendingOrders, paidOrders, processingOrders, readyOrders },
      paidQueue,
      unpaidQueue,
      recentOrders,
      lowStock
    });
  } catch (error) {
    console.error('Staff stats error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStaffStats };
