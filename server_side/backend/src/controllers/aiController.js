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

/**
 * AI Chat Assistant
 * @route POST /api/ai/chat
 * @access Private
 */
const aiChat = async (req, res) => {
  try {
    const { message, history } = req.body;
    const userId = req.user.id;

    // Get user context
    const { User, OrderItem } = require('../models');
    const user = await User.findByPk(userId, {
      attributes: ['username', 'business_name', 'tier', 'wallet_balance']
    });

    // Get user's recent orders for context
    const recentOrders = await Order.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [{ model: OrderItem, include: [Product] }]
    });

    // Simple rule-based AI responses (you can integrate OpenAI/Anthropic API here)
    let response = '';

    const lowerMessage = message.toLowerCase();

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
      response = `Based on your ${user.tier} tier, I recommend:\n`;
      topProducts.forEach((p, i) => {
        response += `${i + 1}. ${p.name} - KES ${p.price}\n`;
      });
    } else if (lowerMessage.includes('wallet') || lowerMessage.includes('balance')) {
      response = `Your current wallet balance is KES ${user.wallet_balance}. `;
      if (parseFloat(user.wallet_balance) < 1000) {
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
    } else if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      response = `I can help you with:
• Checking order status
• Product recommendations
• Wallet balance inquiries
• Finding best sellers
• Inventory insights
• Sales trends

What would you like to know?`;
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
      response = `Hi ${user.business_name}! I'm here to help. You can ask me about:
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
