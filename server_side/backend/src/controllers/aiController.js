const { UserInventory, Product, AIPrediction, Order, sequelize } = require('../models');
const { Op } = require('sequelize');

const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Low Stock Alerts from UserInventory
    const stockAlerts = await UserInventory.findAll({
      where: {
        user_id: userId,
        current_stock: { [Op.lte]: sequelize.col('reorder_point') }
      },
      include: [{ model: Product, attributes: ['id', 'name', 'image_url'] }]
    });

    // 2. Global Demand Insights (AIPredictions)
    const demandInsights = await AIPrediction.findAll({
      where: { prediction_type: 'demand' },
      include: [{ model: Product, attributes: ['id', 'name'] }],
      limit: 5,
      order: [['confidence', 'DESC']]
    });

    // 3. Spending Analytics (Simplified: total spent this month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const totalSpent = await Order.sum('total_amount', {
      where: {
        user_id: userId,
        payment_status: 'paid',
        createdAt: { [Op.gte]: startOfMonth }
      }
    });

    res.json({
      stockAlerts,
      demandInsights,
      spendingAnalytics: {
        totalSpent: totalSpent || 0,
        month: startOfMonth.toLocaleString('default', { month: 'long' })
      }
    });
  } catch (error) {
    console.error('AI Dashboard error:', error);
    res.status(500).json({ message: 'Error fetching AI dashboard data' });
  }
};

const getAdminForecast = async (req, res) => {
  try {
    const predictions = await AIPrediction.findAll({
      where: { prediction_type: 'demand' },
      include: [{ model: Product, attributes: ['id', 'name', 'sku'] }],
      order: [['predicted_value', 'DESC']]
    });

    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin forecasts' });
  }
};

module.exports = {
  getUserDashboardData,
  getAdminForecast
};
