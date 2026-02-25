const { Product, OrderItem, Order, AIPrediction, sequelize } = require('../models');
const { Op } = require('sequelize');

const getRestockPrediction = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate 7-day sales velocity
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const sales = await OrderItem.findAll({
      where: {
        product_id: productId,
        createdAt: { [Op.gte]: sevenDaysAgo }
      },
      include: [{
        model: Order,
        where: { payment_status: 'paid' }
      }]
    });

    const totalSold = sales.reduce((acc, item) => acc + item.quantity, 0);
    const velocity = totalSold / 7;

    if (velocity === 0) {
      return res.json({
        productId,
        velocity: 0,
        predictedRestockDate: 'Unknown (No sales)',
        daysRemaining: Infinity
      });
    }

    const daysRemaining = product.current_stock / velocity;
    const restockDate = new Date();
    restockDate.setDate(restockDate.getDate() + daysRemaining);

    res.json({
      productId,
      velocity,
      currentStock: product.current_stock,
      daysRemaining: Math.round(daysRemaining),
      predictedRestockDate: restockDate.toISOString().split('T')[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDemandForecast = async (req, res) => {
  try {
    // Simple demand forecast logic
    // In a real system, we'd use TensorFlow.js or a more complex model
    const products = await Product.findAll({
      where: { is_active: true }
    });

    const forecasts = [];

    for (const product of products) {
      // Get last 30 days of sales
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const sales = await OrderItem.findAll({
        where: {
          product_id: product.id,
          createdAt: { [Op.gte]: thirtyDaysAgo }
        },
        include: [{
          model: Order,
          where: { payment_status: 'paid' }
        }]
      });

      const totalSold = sales.reduce((acc, item) => acc + item.quantity, 0);
      const averageDailyDemand = totalSold / 30;

      // Predict next 30 days
      const predictedDemand = averageDailyDemand * 30;

      forecasts.push({
        productId: product.id,
        name: product.name,
        averageDailyDemand,
        predictedDemandNext30Days: Math.round(predictedDemand),
        confidence: 0.8 // Dummy confidence value
      });
    }

    res.json(forecasts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRestockPrediction,
  getDemandForecast
};
