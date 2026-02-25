const { User, Order, Product, Category, sequelize } = require('../models');
const { Op } = require('sequelize');

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateKYC = async (req, res) => {
  try {
    const { kyc_status, credit_limit } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update({ kyc_status, credit_limit });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSalesAnalytics = async (req, res) => {
  try {
    // Daily sales for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sales = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'order_count']
      ],
      where: {
        payment_status: 'paid',
        createdAt: { [Op.gte]: thirtyDaysAgo }
      },
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    const revenueByTier = await Order.findAll({
      attributes: [
        'order_type',
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue']
      ],
      where: { payment_status: 'paid' },
      group: ['order_type']
    });

    res.json({ sales, revenueByTier });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInventoryHealth = async (req, res) => {
  try {
    const lowStock = await Product.findAll({
      where: {
        current_stock: { [Op.lte]: sequelize.col('reorder_point') }
      },
      include: [Category]
    });

    const topSelling = await sequelize.query(`
      SELECT p.name, SUM(oi.quantity) as total_sold
      FROM "Products" p
      JOIN "OrderItems" oi ON p.id = oi.product_id
      JOIN "Orders" o ON oi.order_id = o.id
      WHERE o.payment_status = 'paid'
      GROUP BY p.name
      ORDER BY total_sold DESC
      LIMIT 10
    `, { type: sequelize.QueryTypes.SELECT });

    res.json({ lowStock, topSelling });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  updateKYC,
  getSalesAnalytics,
  getInventoryHealth
};
