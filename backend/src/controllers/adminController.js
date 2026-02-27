const { User, Order, Product, Category, OrderItem, sequelize } = require('../models'); // 👈 added OrderItem
const { Op } = require('sequelize');

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = search ? {
      [Op.or]: [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { business_name: { [Op.iLike]: `%${search}%` } } // 👈 fixed field name
      ]
    } : {};

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      users: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user KYC status and credit limit
// @route   PUT /api/admin/users/:id/kyc
// @access  Private/Admin
const updateKYC = async (req, res) => {
  try {
    const { kyc_status, credit_limit } = req.body;

    // Validate input
    const validStatuses = ['pending', 'verified', 'rejected'];
    if (kyc_status && !validStatuses.includes(kyc_status)) {
      return res.status(400).json({ message: 'Invalid KYC status' });
    }
    if (credit_limit && (isNaN(credit_limit) || credit_limit < 0)) {
      return res.status(400).json({ message: 'Credit limit must be a non-negative number' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ kyc_status, credit_limit });
    // Remove password from response
    const { password, ...userData } = user.toJSON();
    res.json(userData);
  } catch (error) {
    console.error('Error in updateKYC:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get sales analytics with optional date range
// @route   GET /api/admin/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = { payment_status: 'paid' };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      where.createdAt = { [Op.gte]: thirtyDaysAgo };
    }

    // Daily sales
    const dailySales = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalRevenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount']
      ],
      where,
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    // Revenue by tier
    const revenueByTier = await Order.findAll({
      attributes: [
        'order_type',
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount']
      ],
      where,
      group: ['order_type']
    });

    // Total revenue & orders
    const totals = await Order.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalRevenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders']
      ],
      where
    });

    res.json({
      dailySales,
      revenueByTier,
      totals: totals || { totalRevenue: 0, totalOrders: 0 }
    });
  } catch (error) {
    console.error('Error in getSalesAnalytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get inventory health (low stock, top selling)
// @route   GET /api/admin/analytics/inventory
// @access  Private/Admin
const getInventoryHealth = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Low stock products (current stock <= reorder point)
    const lowStock = await Product.findAndCountAll({
      where: {
        current_stock: { [Op.lte]: sequelize.col('reorder_point') }
      },
      include: [{ model: Category, attributes: ['id', 'name'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['current_stock', 'ASC']]
    });

    // Top selling products
    const topSelling = await Product.findAll({
      attributes: [
        'id',
        'name',
        'sku',
        [sequelize.fn('SUM', sequelize.col('OrderItems.quantity')), 'totalSold']
      ],
      include: [{
        model: OrderItem,          // 👈 now OrderItem is defined
        attributes: [],
        required: true,
        include: [{
          model: Order,
          attributes: [],
          where: { payment_status: 'paid' }
        }]
      }],
      group: ['Product.id'],
      order: [[sequelize.col('totalSold'), 'DESC']], // safer than literal
      limit: 10
    });

    // Total products count
    const totalProducts = await Product.count();

    res.json({
      lowStock: {
        items: lowStock.rows,
        total: lowStock.count,
        page: parseInt(page),
        totalPages: Math.ceil(lowStock.count / limit)
      },
      topSelling,
      totalProducts
    });
  } catch (error) {
    console.error('Error in getInventoryHealth:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUsers,
  updateKYC,
  getSalesAnalytics,
  getInventoryHealth
};