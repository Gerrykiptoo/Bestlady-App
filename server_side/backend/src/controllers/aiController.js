const { UserInventory, Product, AIPrediction, Order, OrderItem, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const aiService = require('../services/aiService');
const ss = require('simple-statistics'); // for admin forecast

// -------------------- 1. USER DASHBOARD (existing) --------------------
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user?.id;

    const platformAnalytics = await aiService.getPlatformAnalytics();

    const stockAlerts = userId ? await UserInventory.findAll({
      where: {
        user_id: userId,
        current_stock: { [Op.lte]: sequelize.col('reorder_point') }
      },
      include: [{ model: Product, attributes: ['id', 'name', 'image_url'] }],
      limit: 5
    }) : [];

    const predictions = await AIPrediction.findAll({
      where: { prediction_type: 'demand' },
      include: [{ model: Product, attributes: ['id', 'name', 'sku', 'price'] }],
      limit: 8,
      order: [['confidence', 'DESC']]
    });

    const platformStats = await sequelize.query(`
      SELECT 
        COUNT(DISTINCT o.user_id) as activeUsers,
        COUNT(*) as totalOrders,
        SUM(o.total_amount) as totalRevenue,
        AVG(o.total_amount) as avgOrderValue
      FROM Orders o 
      WHERE o.payment_status = 'paid' AND o.createdAt > NOW() - INTERVAL 30 DAY
    `, { type: sequelize.QueryTypes.SELECT });

    let spendingAnalytics = { totalSpent: 0, trend: 'stable', trendPercent: 0 };
    if (userId) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const totalSpent = await Order.sum('total_amount', {
        where: {
          user_id: userId,
          payment_status: 'paid',
          createdAt: { [Op.gte]: startOfMonth }
        }
      });
      spendingAnalytics.totalSpent = totalSpent || 0;
      spendingAnalytics.month = startOfMonth.toLocaleString('default', { month: 'long' });
    }

    const recommendations = userId ? 
      await Product.findAll({
        where: { is_active: true },
        limit: 6,
        order: [['sales_count', 'DESC']]
      }) :
      await Product.findAll({
        where: { is_active: true, featured: true },
        limit: 6
      });

    res.json({
      stockAlerts,
      predictions,
      platformStats: platformStats[0] || {},
      spendingAnalytics,
      recommendations,
      demandInsights: predictions.slice(0, 5),
      platformAnalytics,
      isGuest: !userId,
      message: userId ? 'Your personalized business dashboard' : 'Platform insights (sign up for personal analytics)'
    });
  } catch (error) {
    console.error('AI Dashboard error:', error);
    res.status(500).json({ message: 'Error fetching AI dashboard data' });
  }
};

// -------------------- 2. BULK OPTIMIZER (existing) --------------------
const bulkOptimize = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await Order.findAll({
      where: { user_id: userId, payment_status: 'completed' },
      include: [{ model: OrderItem, include: [Product] }],
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    if (orders.length === 0) return res.json([]);

    const productStats = {};
    orders.forEach(order => {
      order.OrderItems.forEach(item => {
        const productId = item.product_id;
        const product = item.Product;
        if (!productStats[productId]) {
          productStats[productId] = {
            productId,
            productName: product.name,
            totalQuantity: 0,
            totalSpent: 0,
            lastOrdered: order.createdAt
          };
        }
        productStats[productId].totalQuantity += item.quantity;
        productStats[productId].totalSpent += item.subtotal;
        if (new Date(order.createdAt) > new Date(productStats[productId].lastOrdered)) {
          productStats[productId].lastOrdered = order.createdAt;
        }
      });
    });

    const recommendations = Object.values(productStats)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5)
      .map(stat => {
        const avgQuantity = stat.totalQuantity / Math.min(orders.length, 50);
        const recommendedQuantity = Math.ceil(avgQuantity * 1.2);
        const estimatedSavings = stat.totalSpent * 0.1;
        return {
          productId: stat.productId,
          productName: stat.productName,
          currentAvgOrder: Math.round(avgQuantity),
          recommendedQuantity: recommendedQuantity,
          totalPastOrders: stat.totalQuantity,
          reasoning: `You've ordered ${stat.totalQuantity} units total. Ordering ${recommendedQuantity} now could save ~KES ${Math.round(estimatedSavings)} with bulk pricing and prevent stockouts.`,
          confidence: Math.min(85 + Math.random() * 14, 99).toFixed(0)
        };
      });

    res.json(recommendations);
  } catch (error) {
    console.error('Bulk optimize error:', error);
    res.status(500).json({ message: error.message });
  }
};

// -------------------- 3. AI CHAT (existing) --------------------
const aiChat = async (req, res) => {
  try {
    const { message, history } = req.body;
    const userId = req.user?.id;

    let userContext = null;
    let recentOrders = [];
    let customerAnalytics = null;

    if (userId) {
      userContext = await User.findByPk(userId, {
        attributes: ['username', 'business_name', 'tier', 'wallet_balance', 'location', 'phone']
      });

      recentOrders = await Order.findAll({
        where: { user_id: userId, payment_status: 'completed' },
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [{ model: OrderItem, include: [Product] }]
      });

      customerAnalytics = await aiService.analyzeCustomerPatterns(userId);
    }

    let response = '';
    let quickReplies = [];
    const lowerMessage = message.toLowerCase();

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
    };

    if (!userId) {
      // Guest chat logic (unchanged)
      if (lowerMessage.includes('analytics') || lowerMessage.includes('insight')) {
        const platformData = await aiService.getPlatformAnalytics();
        const { summary } = platformData || {};
        response = `📊 Platform Analytics:\n\n• Active Users: ${summary?.activeUsers || 0}\n• Total Orders (30 days): ${summary?.totalOrders || 0}\n• Total Revenue: ${formatCurrency(summary?.totalRevenue || 0)}\n• Avg Order Value: ${formatCurrency(summary?.avgOrderValue || 0)}\n\nSign up for personalized insights!`;
      } else if (lowerMessage.includes('how') || lowerMessage.includes('work')) {
        response = "BestLady is an AI-powered beauty supply chain platform. We connect beauty businesses with top products and provide intelligent tools like stock prediction and regional demand forecasts to help you grow. Would you like to create an account to see your personal business insights?";
      } else if (lowerMessage.includes('benefit') || lowerMessage.includes('join')) {
        response = "By joining BestLady, you get access to:\n• Wholesale pricing for bulk orders\n• AI-driven stock alerts to never run out of best-sellers\n• Regional demand analytics to see what's trending in your area\n• 24/7 delivery tracking\n• Seamless payments with M-Pesa";
      } else if (lowerMessage.includes('trend') || lowerMessage.includes('popular') || lowerMessage.includes('top product')) {
        const platformData = await aiService.getPlatformAnalytics();
        if (platformData?.topProducts?.length > 0) {
          response = '🔥 Top Performing Products:\n';
          platformData.topProducts.slice(0, 5).forEach((p, i) => {
            response += `${i + 1}. ${p.name} - ${formatCurrency(p.revenue)} revenue\n`;
          });
        } else {
          response = "Right now, Natural Skincare and Organic Hair products are trending across the platform. You can see detailed demand graphs on our home page!";
        }
      } else if (lowerMessage.includes('region') || lowerMessage.includes('area')) {
        const regions = await aiService.getRegionalInsights();
        if (regions.length > 0) {
          response = '🌍 Regional Performance:\n';
          regions.slice(0, 5).forEach((r, i) => {
            response += `${i + 1}. ${r.region || 'Unknown'}: ${formatCurrency(r.revenue)} revenue\n`;
          });
        } else {
          response = "Sign up to see regional demand analytics for your area!";
        }
      } else if (lowerMessage.includes('account') || lowerMessage.includes('sign up')) {
        response = "Creating an account is easy! Just click the 'Sign Up' button in the top right corner. You can register as a retail salon or a wholesale distributor to get tailored pricing and AI insights.";
      } else {
        response = "Hello! I'm the BestLady AI Assistant. I help business owners optimize their beauty supply chain.\n\n💡 Ask me about:\n• Platform analytics\n• Trending products\n• Regional insights\n• How the platform works\n• Benefits of joining\n\nFor personalized order tracking and stock alerts, please log in!";
      }
      return res.json({ response });
    }

    // Authenticated user chat logic (unchanged)
    if (lowerMessage.includes('analytics') || lowerMessage.includes('my stats') || lowerMessage.includes('my spend')) {
      if (customerAnalytics) {
        response = `📊 Your Business Analytics:\n\n💰 Spending:\n• Total Spent: ${formatCurrency(customerAnalytics.totalSpent)}\n• Avg Order: ${formatCurrency(customerAnalytics.avgOrderValue)}\n• Orders: ${customerAnalytics.totalOrders}\n\n📈 Activity:\n• Monthly Purchases: ${customerAnalytics.purchaseFrequency}\n• Preferred: ${customerAnalytics.preferredPayment}\n\n🏆 Top Categories:\n`;
        customerAnalytics.topCategories.slice(0, 3).forEach((c, i) => {
          response += `${i + 1}. ${c.name}: ${formatCurrency(c.spent)}\n`;
        });
      } else {
        response = "Loading your analytics...";
      }
    } else if ((lowerMessage.includes('order') || lowerMessage.includes('purchase')) && (lowerMessage.includes('list') || lowerMessage.includes('all') || lowerMessage.includes('history'))) {
      if (recentOrders.length > 0) {
        response = `📋 Your Order History:\n\n`;
        recentOrders.forEach((o, i) => {
          response += `${i + 1}. #${o.order_number} - ${o.status} - ${formatCurrency(o.total_amount)}\n   ${new Date(o.createdAt).toLocaleDateString()}\n`;
        });
        response += `\n💰 Total Spent: ${formatCurrency(customerAnalytics?.totalSpent || 0)}`;
      } else {
        response = "You don't have any completed orders yet.";
      }
      quickReplies = ['Browse Products', 'Order Status'];
    } else if (lowerMessage.includes('order') && (lowerMessage.includes('status') || lowerMessage.includes('track'))) {
      if (recentOrders.length > 0) {
        const latestOrder = recentOrders[0];
        const statusEmoji = latestOrder.status === 'completed' ? '✅' : latestOrder.status === 'paid' ? '💰' : '⏳';
        response = `📦 Latest Order #${latestOrder.order_number}\n\n${statusEmoji} Status: ${latestOrder.status}\n💵 Payment: ${latestOrder.payment_status}\n💰 Amount: ${formatCurrency(latestOrder.total_amount)}\n📅 Date: ${new Date(latestOrder.createdAt).toLocaleString()}\n🚚 Delivery: ${latestOrder.delivery_channel}`;
      } else {
        response = "You don't have any orders yet. Would you like to browse our products?";
      }
      quickReplies = ['Order History', 'Create Order'];
    } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggestion')) {
      const topProducts = await Product.findAll({
        limit: 4,
        order: [['sales_count', 'DESC']],
        where: { is_active: true }
      });
      response = `✨ Recommended for your ${userContext.tier} tier:\n\n`;
      topProducts.forEach((p, i) => {
        response += `${i + 1}. ${p.name} - ${formatCurrency(p.retail_price)}\n   Stock: ${p.current_stock} units\n`;
      });
      response += `\nThese are our best-selling items!`;
    } else if (lowerMessage.includes('wallet') || lowerMessage.includes('balance') || lowerMessage.includes('top up')) {
      response = `💳 Wallet Balance: ${formatCurrency(userContext.wallet_balance)}\n\n`;
      if (parseFloat(userContext.wallet_balance) < 1000) {
        response += '⚠️ Your balance is low. Would you like to top up?';
      } else {
        response += '✅ Your wallet is ready for purchases!';
      }
      quickReplies = ['Top Up Wallet'];
    } else if (lowerMessage.includes('best seller') || lowerMessage.includes('popular') || lowerMessage.includes('trending')) {
      const bestSellers = await OrderItem.findAll({
        attributes: ['product_id', [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold']],
        include: [{ model: Product, attributes: ['name', 'price', 'image_url'] }],
        group: ['product_id', 'Product.id'],
        order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
        limit: 5
      });
      response = '🔥 Trending Products:\n\n';
      bestSellers.forEach((item, i) => {
        response += `${i + 1}. ${item.Product.name} - ${formatCurrency(item.Product.price)}\n   Sold: ${item.dataValues.totalSold} units\n`;
      });
    } else if (lowerMessage.includes('inventory') || lowerMessage.includes('stock') || lowerMessage.includes('low')) {
      const lowStockProducts = await Product.findAll({
        where: {
          is_active: true,
          current_stock: { [Op.lt]: sequelize.col('reorder_level') }
        },
        limit: 5
      });
      if (lowStockProducts.length > 0) {
        response = `⚠️ Low Stock Alert:\n\n`;
        lowStockProducts.forEach((p, i) => {
          response += `${i + 1}. ${p.name}\n   Current: ${p.current_stock} | Reorder at: ${p.reorder_level}\n`;
        });
        response += `\n💡 Consider restocking soon!`;
      } else {
        response = '✅ All inventory levels are healthy! No low stock alerts.';
      }
      quickReplies = ['Order History', 'Platform Analytics'];
    } else if (lowerMessage.includes('help')) {
      response = `Hi ${userContext.username}! I'm here to help.\n\n💡 You can ask me about:\n\n📦 Orders\n   • Order status\n   • Order history\n   • Track order\n\n💰 Wallet\n   • Balance\n   • Top up\n\n📊 Analytics\n   • My spending\n   • My stats\n\n🏷️ Products\n   • Recommendations\n   • Best sellers\n   • Low stock\n\nWhat would you like to know?`;
    } else {
      response = `Hi ${userContext.username}! 👋\n\nI'm your AI assistant. Try asking me:\n\n• "My order status"\n• "My order history"\n• "My analytics"\n• "My wallet balance"\n• "Best sellers"\n• "Low stock alert"\n• "Recommendations"\n\nHow can I help you today?`;
    }

    res.json({ response, quickReplies });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ 
      response: "I'm sorry, I encountered an error. Please try again or contact support if the issue persists."
    });
  }
};

// -------------------- 4. ADMIN FORECAST (NEW) --------------------
const getAdminForecast = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const orders = await Order.findAll({
      where: {
        payment_status: 'completed',
        createdAt: { [Op.gte]: ninetyDaysAgo }
      },
      attributes: ['total_amount', 'createdAt', 'order_type', 'status']
    });

    if (orders.length === 0) {
      return res.json({
        message: 'Not enough data yet – complete more orders to see forecasts.',
        history: [],
        forecast: [],
        summary: { totalRevenue: 0, avgOrderValue: 0, orderCount: 0 }
      });
    }

    // Aggregate daily revenues
    const dailyMap = new Map();
    for (const order of orders) {
      const date = order.createdAt.toISOString().slice(0, 10);
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { revenue: 0, orders: 0, retail: 0, wholesale: 0 });
      }
      const entry = dailyMap.get(date);
      entry.revenue += parseFloat(order.total_amount);
      entry.orders++;
      if (order.order_type === 'retail') entry.retail++;
      else if (order.order_type === 'wholesale') entry.wholesale++;
    }

    let dailyData = Array.from(dailyMap.entries())
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const last30Days = dailyData.slice(-30);
    if (last30Days.length < 7) {
      return res.json({
        message: 'Need at least 7 days of data for forecasting.',
        history: last30Days,
        forecast: [],
        summary: calculateOrderSummary(orders)
      });
    }

    const revenues = last30Days.map(d => d.revenue);
    const movingAverage = ss.movingAverage(revenues, 7);
    const indices = revenues.map((_, i) => i);
    const regression = ss.linearRegression(indices.map(i => [i, revenues[i]]));
    const line = ss.linearRegressionLine(regression);

    const next7Days = [];
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);
      const dateStr = futureDate.toISOString().slice(0, 10);
      const predictedRevenue = line(indices.length + i);
      const finalPrediction = Math.max(0, Math.round(predictedRevenue * (0.95 + Math.random() * 0.1)));
      next7Days.push({
        date: dateStr,
        predictedRevenue: finalPrediction,
        lowerBound: Math.max(0, Math.round(predictedRevenue * 0.8)),
        upperBound: Math.round(predictedRevenue * 1.2)
      });
    }

    const summary = {
      totalRevenue: revenues.reduce((a, b) => a + b, 0),
      avgOrderValue: orders.reduce((a, b) => a + parseFloat(b.total_amount), 0) / orders.length,
      orderCount: orders.length,
      retailPercentage: (orders.filter(o => o.order_type === 'retail').length / orders.length * 100).toFixed(1),
      wholesalePercentage: (orders.filter(o => o.order_type === 'wholesale').length / orders.length * 100).toFixed(1)
    };

    // Top selling products (simplified)
    const topProducts = await Order.findAll({
      attributes: [
        'id',
        [sequelize.literal(`(
          SELECT SUM(quantity) FROM "OrderItems" WHERE "OrderItems"."order_id" = "Order"."id"
        )`), 'totalSold']
      ],
      include: [{ model: Product, attributes: ['name', 'sku'] }],
      where: { payment_status: 'completed' },
      group: ['Order.id', 'Product.id'],
      order: [[sequelize.literal('totalSold'), 'DESC']],
      limit: 5,
      subQuery: false
    });

    res.json({
      history: last30Days.map(d => ({ date: d.date, revenue: d.revenue, orders: d.orders })),
      movingAverages: movingAverage,
      forecast: next7Days,
      summary,
      topProducts: topProducts.map(p => ({
        name: p.Product.name,
        sku: p.Product.sku,
        sold: p.dataValues.totalSold || 0
      })),
      trendDirection: regression.m > 0 ? 'increasing' : 'decreasing',
      confidence: Math.min(95, Math.max(60, 100 - (Math.abs(regression.m) * 10)))
    });
  } catch (error) {
    console.error('Admin forecast error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Helper for summary when insufficient data
function calculateOrderSummary(orders) {
  const totalRevenue = orders.reduce((s, o) => s + parseFloat(o.total_amount), 0);
  return {
    totalRevenue,
    avgOrderValue: totalRevenue / orders.length,
    orderCount: orders.length,
    retailPercentage: ((orders.filter(o => o.order_type === 'retail').length / orders.length) * 100).toFixed(1),
    wholesalePercentage: ((orders.filter(o => o.order_type === 'wholesale').length / orders.length) * 100).toFixed(1)
  };
}

// -------------------- EXPORTS --------------------
module.exports = {
  getUserDashboardData,
  bulkOptimize,
  aiChat,
  getAdminForecast
};