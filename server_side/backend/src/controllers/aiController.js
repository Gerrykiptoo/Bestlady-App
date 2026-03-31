const { UserInventory, Product, AIPrediction, Order, sequelize } = require('../models');
const { Op } = require('sequelize');

const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user?.id; // Optional for guests

    // 1. Low Stock Alerts from UserInventory (authenticated only)
    const stockAlerts = userId ? await UserInventory.findAll({
      where: {
        user_id: userId,
        current_stock: { [Op.lte]: sequelize.col('reorder_point') }
      },
      include: [{ model: Product, attributes: ['id', 'name', 'image_url'] }],
      limit: 5
    }) : [];

    // 2. Business Projections & Forecasts from AIPredictions
    const predictions = await AIPrediction.findAll({
      where: { prediction_type: 'demand' },
      include: [{ model: Product, attributes: ['id', 'name', 'sku', 'price'] }],
      limit: 8,
      order: [['confidence', 'DESC']]
    });

    // 3. Aggregate Platform Stats (guest-friendly)
    const platformStats = await sequelize.query(`
      SELECT 
        COUNT(DISTINCT o.user_id) as activeUsers,
        COUNT(*) as totalOrders,
        SUM(o.total_amount) as totalRevenue,
        AVG(o.total_amount) as avgOrderValue
      FROM Orders o 
      WHERE o.payment_status = 'paid' AND o.createdAt > NOW() - INTERVAL 30 DAY
    `, { type: sequelize.QueryTypes.SELECT });

    // 4. Personalized Spending (if user logged in)
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

    // 5. Smart Recommendations based on user tier or popular
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
      isGuest: !userId,
      message: userId ? 'Your personalized business dashboard' : 'Platform insights (sign up for personal analytics)'
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

/**
 * AI Chat Assistant
 * @route POST /api/ai/chat
 * @access Public/Optional Auth
 */
const aiChat = async (req, res) => {
  try {
    const { message, history } = req.body;
    const userId = req.user?.id;
    const { User, OrderItem, Product, Order } = require('../models');

    let userContext = null;
    let recentOrders = [];

    if (userId) {
      userContext = await User.findByPk(userId, {
        attributes: ['username', 'business_name', 'tier', 'wallet_balance']
      });

      recentOrders = await Order.findAll({
        where: { user_id: userId },
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [{ model: OrderItem, include: [Product] }]
      });
    }

    let response = '';
    const lowerMessage = message.toLowerCase();

    // Guest context handling
    if (!userId) {
      if (lowerMessage.includes('how') || lowerMessage.includes('work')) {
        response = "BestLady is an AI-powered beauty supply chain platform. We connect beauty businesses with top products and provide intelligent tools like stock prediction and regional demand forecasts to help you grow. Would you like to create an account to see your personal business insights?";
      } else if (lowerMessage.includes('benefit') || lowerMessage.includes('join')) {
        response = "By joining BestLady, you get access to:\n• Wholesale pricing for bulk orders\n• AI-driven stock alerts to never run out of best-sellers\n• Regional demand analytics to see what's trending in your area\n• 24/7 delivery tracking\n• Seamless payments with M-Pesa";
      } else if (lowerMessage.includes('trend') || lowerMessage.includes('popular')) {
        response = "Right now, Natural Skincare and Organic Hair products are trending across the platform. You can see detailed demand graphs on our home page! Sign up to see trends specific to your branch location.";
      } else if (lowerMessage.includes('account') || lowerMessage.includes('sign up')) {
        response = "Creating an account is easy! Just click the 'Sign Up' button in the top right corner. You can register as a retail salon or a wholesale distributor to get tailored pricing and AI insights.";
      } else {
        response = "Hello! I'm the BestLady AI Assistant. I help business owners optimize their beauty supply chain. You can ask me how the platform works, the benefits of joining, or trending products. For personalized order tracking and stock alerts, please log in or create an account!";
      }
      return res.json({ response });
    }

    // Authenticated user logic
    if (lowerMessage.includes('order') && lowerMessage.includes('status')) {
      if (recentOrders.length > 0) {
        const latestOrder = recentOrders[0];
        response = `Your latest order (#${latestOrder.order_number}) is currently ${latestOrder.status}. `;
        if (latestOrder.payment_status === 'paid') {
          response += 'Payment has been confirmed. ';
        } else {
          response += 'Payment is pending. ';
        }
        response += `Total amount: KES ${latestOrder.total_amount}`;
      } else {
        response = "You don't have any orders yet. Would you like to browse our products?";
      }
    } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggestion')) {
      const topProducts = await Product.findAll({
        limit: 3,
        order: [['createdAt', 'DESC']],
        where: { is_active: true }
      });
      response = `Based on your ${userContext.tier} tier, I recommend:\n`;
      topProducts.forEach((p, i) => {
        response += `${i + 1}. ${p.name} - KES ${p.price}\n`;
      });
    } else if (lowerMessage.includes('wallet') || lowerMessage.includes('balance')) {
      response = `Your current wallet balance is KES ${userContext.wallet_balance}. `;
      if (parseFloat(userContext.wallet_balance) < 1000) {
        response += 'Would you like to top up your wallet?';
      }
    } else if (lowerMessage.includes('best seller') || lowerMessage.includes('popular')) {
      const bestSellers = await OrderItem.findAll({
        attributes: ['product_id'],
        include: [{ model: Product, attributes: ['name', 'price'] }],
        group: ['product_id', 'Product.id'],
        order: [[sequelize.fn('COUNT', sequelize.col('product_id')), 'DESC']],
        limit: 3
      });
      response = 'Our current best sellers are:\n';
      bestSellers.forEach((item, i) => {
        response += `${i + 1}. ${item.Product.name} - KES ${item.Product.price}\n`;
      });
    } else if (lowerMessage.includes('inventory') || lowerMessage.includes('stock')) {
      const lowStockProducts = await Product.findAll({
        where: {
          current_stock: { [Op.lt]: sequelize.col('reorder_level') }
        },
        limit: 5
      });
      if (lowStockProducts.length > 0) {
        response = `⚠️ You have ${lowStockProducts.length} products running low on stock:\n`;
        lowStockProducts.forEach((p, i) => {
          response += `${i + 1}. ${p.name} - Only ${p.current_stock} left\n`;
        });
      } else {
        response = 'All your inventory levels look good! No low stock alerts.';
      }
    } else {
      response = `Hi ${userContext.username}! I'm here to help. You can ask me about:
• Your orders and their status
• Product recommendations
• Wallet balance
• Best selling products
• Inventory levels
• Sales insights

What would you like to know?`;
    }

    res.json({ response });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ 
      response: "I'm sorry, I encountered an error. Please try again or contact support if the issue persists."
    });
  }
};

module.exports = {
  getUserDashboardData,
  getAdminForecast,
  aiChat
};
