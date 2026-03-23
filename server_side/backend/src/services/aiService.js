const { Product, OrderItem, Order } = require('../models');
const { Op } = require('sequelize');

/**
 * Calculate sales velocity for a product over a given period
 * @param {string} productId - UUID of product
 * @param {number} days - number of days to look back
 * @returns {Promise<number>} average daily sales quantity
 */
const calculateSalesVelocity = async (productId, days = 7) => {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const sales = await OrderItem.sum('quantity', {
    where: {
      product_id: productId,
      createdAt: { [Op.gte]: since }
    },
    include: [{
      model: Order,
      where: { payment_status: 'paid' }
    }]
  });

  return sales / days;
};

/**
 * Predict restock date for a product based on current stock and velocity
 * @param {Object} product - Product instance
 * @returns {Promise<Object>} prediction result
 */
const predictRestock = async (product) => {
  const velocity = await calculateSalesVelocity(product.id, 7);
  if (velocity === 0) {
    return {
      productId: product.id,
      currentStock: product.current_stock,
      daysRemaining: null,
      predictedRestockDate: null,
      confidence: 0.2
    };
  }
  const daysRemaining = Math.round(product.current_stock / velocity);
  const restockDate = new Date();
  restockDate.setDate(restockDate.getDate() + daysRemaining);
  return {
    productId: product.id,
    currentStock: product.current_stock,
    daysRemaining,
    predictedRestockDate: restockDate.toISOString().split('T')[0],
    confidence: 0.8
  };
};

/**
 * Demand forecast for all products (simple moving average)
 * @returns {Promise<Array>} forecast data
 */
const forecastDemand = async () => {
  const products = await Product.findAll({ where: { is_active: true } });
  const forecasts = [];

  for (const product of products) {
    const velocity = await calculateSalesVelocity(product.id, 30);
    forecasts.push({
      productId: product.id,
      name: product.name,
      averageDailyDemand: velocity,
      predictedDemandNext30Days: Math.round(velocity * 30),
      confidence: 0.7
    });
  }
  return forecasts;
};

module.exports = {
  calculateSalesVelocity,
  predictRestock,
  forecastDemand
};