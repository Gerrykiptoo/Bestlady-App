const { User, Product, Order, Category, OrderItem, WalletTransaction, sequelize } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json({ users, total: users.length });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// @desc    Get sales analytics
const getSalesAnalytics = async (req, res) => {
  try {
    const dailySales = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalRevenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount']
      ],
      where: { payment_status: 'completed' },
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'DESC']],
      limit: 30
    });

    const revenueByTier = await Order.findAll({
      attributes: [
        'order_type',
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue']
      ],
      where: { payment_status: 'completed' },
      group: ['order_type']
    });

    const totals = await Order.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalRevenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders']
      ],
      where: { payment_status: 'completed' }
    });

    res.json({
      dailySales,
      revenueByTier,
      totals: totals[0] || { totalRevenue: 0, totalOrders: 0 }
    });
  } catch (error) {
    console.error('Get sales analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch sales analytics' });
  }
};

// @desc    Get inventory health (fixed topSelling query)
const getInventoryHealth = async (req, res) => {
  try {
    const lowStock = await Product.findAndCountAll({
      where: {
        current_stock: { [Op.lte]: sequelize.col('reorder_point') },
        is_active: true
      }
    });

    const topSelling = await OrderItem.findAll({
      attributes: [
        'product_id',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold'],
        [sequelize.fn('SUM', sequelize.col('subtotal')), 'revenue']
      ],
      include: [{ model: Product, attributes: ['id', 'name', 'sku', 'image_url', 'retail_price', 'wholesale_price'] }],
      group: ['product_id', 'Product.id'],
      order: [[sequelize.literal('totalSold'), 'DESC']],
      limit: 10,
      where: {
        createdAt: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    });

    const totalProducts = await Product.count({ where: { is_active: true } });

    res.json({
      lowStock: { total: lowStock.count, items: lowStock.rows },
      topSelling,
      totalProducts
    });
  } catch (error) {
    console.error('Get inventory health error:', error);
    res.status(500).json({ message: 'Failed to fetch inventory health' });
  }
};

// @desc    Update user KYC status
const updateKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const { kyc_status } = req.body;
    if (!['pending', 'verified', 'rejected'].includes(kyc_status)) {
      return res.status(400).json({ message: 'Invalid KYC status' });
    }
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.kyc_status = kyc_status;
    await user.save();
    const { password, ...userData } = user.toJSON();
    res.json(userData);
  } catch (error) {
    console.error('Update KYC error:', error);
    res.status(500).json({ message: 'Failed to update KYC status' });
  }
};

// @desc    Create new user (admin only)
const createUser = async (req, res) => {
  try {
    const { username, email, password, phone, business_name, business_type, role, tier, kyc_status } = req.body;
    const allowedRoles = ['user', 'staff', 'agent'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role for user creation' });
    }
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const wholesaleTypes = ['mall', 'large_supermarket', 'chain_store', 'distributor', 'exporter', 'institution'];
    const finalTier = tier || (wholesaleTypes.includes(business_type) ? 'wholesale' : 'retail');

    const user = await User.create({
      username, email, password, phone, business_name, business_type, role,
      tier: finalTier,
      kyc_status: kyc_status || 'pending',
      wallet_balance: 0,
      credit_limit: finalTier === 'wholesale' ? 50000 : 0
    });
    const { password: _, ...userData } = user.toJSON();
    res.status(201).json(userData);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user
const updateUser = async (req, res) => {
  try {
    const { role, tier, kyc_status, credit_limit, is_active } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updateData = {};
    if (role && ['user', 'staff', 'agent', 'admin'].includes(role)) updateData.role = role;
    if (tier && ['retail', 'wholesale'].includes(tier)) updateData.tier = tier;
    if (kyc_status && ['pending', 'verified', 'rejected'].includes(kyc_status)) updateData.kyc_status = kyc_status;
    if (credit_limit !== undefined) updateData.credit_limit = parseFloat(credit_limit) || 0;
    if (is_active !== undefined) updateData.is_active = is_active;

    await user.update(updateData);
    const { password, ...userData } = user.toJSON();
    res.json(userData);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete admin user' });
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get platform analytics
const getPlatformAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalProducts = await Product.count({ where: { is_active: true } });
    const totalOrders = await Order.count({ where: { payment_status: 'completed' } });
    const revenue = await Order.sum('total_amount', { where: { payment_status: 'completed' } });

    const topCategories = await Category.findAll({
      attributes: [
        'name',
        [sequelize.fn('COUNT', sequelize.col('Products.id')), 'productCount']
      ],
      include: [{ model: Product, attributes: [], where: { is_active: true }, required: false }],
      group: ['Category.id'],
      order: [[sequelize.literal('productCount'), 'DESC']],
      limit: 5
    });

    res.json({ totalUsers, totalProducts, totalOrders, revenue: revenue || 0, topCategories });
  } catch (error) {
    console.error('Get platform analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch platform analytics' });
  }
};

module.exports = {
  getUsers,
  getSalesAnalytics,
  getInventoryHealth,
  updateKYC,
  createUser,
  updateUser,
  deleteUser,
  getPlatformAnalytics
};