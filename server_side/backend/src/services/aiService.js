const { Product, OrderItem, Order, User, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Calculate sales velocity for a product over a given period
 * @param {string} productId - UUID of product
 * @param {number} days - number of days to look back
 * @returns {Promise<number>} average daily sales quantity
 */
const PAID_STATUSES = ['paid', 'processing', 'completed', 'dispatched', 'delivered'];

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
      where: { payment_status: { [Op.in]: PAID_STATUSES } }
    }]
  });

  return (sales || 0) / days;
};

/**
 * Analyze customer purchase patterns
 * @param {string} userId - UUID of user
 * @returns {Promise<Object>} customer analytics
 */
const analyzeCustomerPatterns = async (userId) => {
  const orders = await Order.findAll({
    where: { user_id: userId, payment_status: { [Op.in]: PAID_STATUSES } },
    include: [{ model: OrderItem, include: [Product] }],
    order: [['createdAt', 'DESC']],
    limit: 30
  });

  if (!orders.length) {
    return { totalOrders: 0, totalSpent: 0, avgOrderValue: 0, topCategories: [], purchaseFrequency: 0 };
  }

  const totalSpent = orders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
  const avgOrderValue = totalSpent / orders.length;
  
  const categorySpend = {};
  orders.forEach(order => {
    order.OrderItems.forEach(item => {
      const category = item.Product?.category || 'Uncategorized';
      categorySpend[category] = (categorySpend[category] || 0) + item.subtotal;
    });
  });

  const topCategories = Object.entries(categorySpend)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, spent: value }));

  const firstOrder = orders[orders.length - 1]?.createdAt;
  const lastOrder = orders[0]?.createdAt;
  const daysDiff = firstOrder && lastOrder ? Math.max(1, (new Date(lastOrder) - new Date(firstOrder)) / (1000 * 60 * 60 * 24)) : 1;
  const purchaseFrequency = orders.length / daysDiff;

  return {
    totalOrders: orders.length,
    totalSpent: Math.round(totalSpent),
    avgOrderValue: Math.round(avgOrderValue),
    topCategories,
    purchaseFrequency: Math.round(purchaseFrequency * 30),
    lastPurchaseDate: orders[0]?.createdAt,
    preferredPayment: orders[0]?.payment_method
  };
};

/**
 * Get regional demand insights
 * @returns {Promise<Object>} regional analytics
 */
const getRegionalInsights = async () => {
  try {
    const insights = await sequelize.query(`
      SELECT 
        u.location as region,
        COUNT(DISTINCT o.id) as orderCount,
        SUM(o.total_amount) as revenue,
        AVG(o.total_amount) as avgOrder
      FROM "Orders" o
      JOIN "Users" u ON o.user_id = u.id
      WHERE o.payment_status = 'completed' AND o."createdAt" > NOW() - INTERVAL '30 days'
      GROUP BY u.location
      ORDER BY revenue DESC
      LIMIT 10
    `, { type: sequelize.QueryTypes.SELECT });

    return insights;
  } catch (error) {
    console.error('Regional insights error:', error);
    return [];
  }
};

/**
 * Get platform-wide analytics dashboard
 * @returns {Promise<Object>} platform stats
 */
const getPlatformAnalytics = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const stats = await sequelize.query(`
    SELECT 
      COUNT(DISTINCT o.user_id) as activeUsers,
      COUNT(*) as totalOrders,
      SUM(CASE WHEN o.payment_status = 'completed' THEN o.total_amount ELSE 0 END) as totalRevenue,
      AVG(CASE WHEN o.payment_status = 'completed' THEN o.total_amount END) as avgOrderValue,
      COUNT(CASE WHEN o.status = 'paid' OR o.status = 'completed' THEN 1 END) as paidOrders,
      COUNT(CASE WHEN o."createdAt" > NOW() - INTERVAL '7 days' THEN 1 END) as weeklyOrders
    FROM "Orders" o
    WHERE o."createdAt" > ?
  `, {
    type: sequelize.QueryTypes.SELECT,
    replacements: [thirtyDaysAgo]
  });

  const topProducts = await sequelize.query(`
    SELECT 
      p.id, p.name, p.image_url,
      SUM(oi.quantity) as totalSold,
      SUM(oi.subtotal) as revenue
    FROM "OrderItems" oi
    JOIN "Products" p ON oi.product_id = p.id
    JOIN "Orders" o ON oi.order_id = o.id
    WHERE o.payment_status = 'completed' AND o."createdAt" > NOW() - INTERVAL '30 days'
    GROUP BY p.id
    ORDER BY revenue DESC
    LIMIT 10
  `, { type: sequelize.QueryTypes.SELECT });

  const lowStock = await Product.findAll({
    where: {
      is_active: true,
      current_stock: { [Op.lte]: sequelize.col('reorder_point') }
    },
    limit: 10,
    order: [['current_stock', 'ASC']]
  });

  return {
    summary: stats[0] || {},
    topProducts,
    lowStockAlerts: lowStock.map(p => ({
      id: p.id,
      name: p.name,
      stock: p.current_stock,
      reorderLevel: p.reorder_point
    }))
  };
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

/**
 * Determine a customer's loyalty discount tier based on lifetime completed orders.
 * Tier   Min orders   Discount
 * Bronze     3           5 %
 * Silver    10           8 %
 * Gold      25          12 %
 * Platinum  50          15 %
 */
const getUserDiscountTier = async (userId) => {
  const completedOrders = await Order.count({
    where: { user_id: userId, payment_status: { [Op.in]: PAID_STATUSES } }
  });

  let tier = null;
  let discountPercent = 0;
  let minOrdersForNext = null;
  let nextTier = null;

  if (completedOrders >= 50) {
    tier = 'Platinum';
    discountPercent = 15;
  } else if (completedOrders >= 25) {
    tier = 'Gold';
    discountPercent = 12;
    minOrdersForNext = 50;
    nextTier = 'Platinum';
  } else if (completedOrders >= 10) {
    tier = 'Silver';
    discountPercent = 8;
    minOrdersForNext = 25;
    nextTier = 'Gold';
  } else if (completedOrders >= 3) {
    tier = 'Bronze';
    discountPercent = 5;
    minOrdersForNext = 10;
    nextTier = 'Silver';
  } else {
    tier = 'New';
    discountPercent = 0;
    minOrdersForNext = 3;
    nextTier = 'Bronze';
  }

  return {
    tier,
    discountPercent,
    completedOrders,
    ordersToNextTier: minOrdersForNext ? Math.max(0, minOrdersForNext - completedOrders) : 0,
    nextTier,
    tierEmoji: { Platinum: '💎', Gold: '🥇', Silver: '🥈', Bronze: '🥉', New: '⭐' }[tier]
  };
};

module.exports = {
  calculateSalesVelocity,
  predictRestock,
  forecastDemand,
  analyzeCustomerPatterns,
  getRegionalInsights,
  getPlatformAnalytics,
  getUserDiscountTier
};