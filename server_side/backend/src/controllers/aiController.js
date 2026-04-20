const { UserInventory, Product, AIPrediction, Order, sequelize } = require('../models');
const { Op } = require('sequelize');
const aiService = require('../services/aiService');

const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user?.id; // Optional for guests

    const platformAnalytics = await aiService.getPlatformAnalytics();

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
      platformAnalytics,
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

    // Analytics queries for authenticated users
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

module.exports = {
  getUserDashboardData,
  getAdminForecast,
  aiChat
};
