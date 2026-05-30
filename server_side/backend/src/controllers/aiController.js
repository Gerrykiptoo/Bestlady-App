const { UserInventory, Product, AIPrediction, Order, OrderItem, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const aiService = require('../services/aiService');
const ss = require('simple-statistics');

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);

// -------------------- 1. USER DASHBOARD --------------------
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user?.id;

    const platformAnalytics = await aiService.getPlatformAnalytics();

    const stockAlerts = userId
      ? await UserInventory.findAll({
          where: {
            user_id: userId,
            current_stock: { [Op.lte]: sequelize.col('UserInventory.reorder_point') }
          },
          include: [{ model: Product, attributes: ['id', 'name', 'image_url'] }],
          limit: 5
        })
      : [];

    const predictions = await AIPrediction.findAll({
      where: { prediction_type: 'demand' },
      attributes: { exclude: ['createdAt'] },
      include: [{ model: Product, attributes: ['id', 'name', 'sku'] }],
      limit: 8,
      order: [['confidence', 'DESC']]
    });

    // ✅ Single‑line query – avoids whitespace errors
    const platformStats = await sequelize.query(
      `SELECT COUNT(DISTINCT o.user_id) as activeUsers, COUNT(*) as totalOrders, SUM(o.total_amount) as totalRevenue, AVG(o.total_amount) as avgOrderValue FROM "Orders" o WHERE o.payment_status = 'paid' AND o."createdAt" > NOW() - INTERVAL '30 days'`,
      { type: sequelize.QueryTypes.SELECT }
    );

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

    // ✅ Use a real column (createdAt) instead of non‑existent sales_count
    const recommendations = userId
      ? await Product.findAll({
          where: { is_active: true },
          limit: 6,
          order: [['createdAt', 'DESC']]
        })
      : await Product.findAll({
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

// -------------------- 2. BULK OPTIMIZER --------------------
const PAID_STATUSES = ['paid', 'processing', 'completed', 'dispatched', 'delivered'];

const bulkOptimize = async (req, res) => {
  try {
    const userId = req.user.id;
    const priceKey = req.user.tier === 'wholesale' ? 'wholesale_price' : 'retail_price';

    const [tierInfo, orders] = await Promise.all([
      aiService.getUserDiscountTier(userId),
      Order.findAll({
        where: { user_id: userId, payment_status: { [Op.in]: PAID_STATUSES } },
        include: [{ model: OrderItem, include: [Product] }],
        order: [['createdAt', 'DESC']],
        limit: 60
      })
    ]);

    const discountMultiplier = 1 - tierInfo.discountPercent / 100;

    // Cold-start: no order history → recommend popular products
    if (orders.length === 0) {
      const popular = await Product.findAll({
        where: { is_active: true, current_stock: { [Op.gt]: 0 } },
        order: [['createdAt', 'DESC']],
        limit: 6
      });
      const coldRecs = popular.map(p => {
        const basePrice = parseFloat(p[priceKey]);
        const discountedPrice = parseFloat((basePrice * discountMultiplier).toFixed(2));
        return {
          productId: p.id,
          productName: p.name,
          productImage: p.image_url,
          currentStock: p.current_stock,
          basePrice,
          discountedPrice,
          discountPercent: tierInfo.discountPercent,
          recommendedQuantity: 5,
          totalCost: parseFloat((discountedPrice * 5).toFixed(2)),
          totalSavings: 0,
          pastOrderCount: 0,
          avgQuantityPerOrder: 0,
          lastOrdered: null,
          stockUrgency: p.current_stock <= (p.reorder_point || 10) ? 'low' : 'normal',
          reasoning: `Popular on BestLady. Place your first order to unlock personalised AI recommendations and loyalty discounts (Bronze at 3 orders = 5% off)!`,
          confidence: 55
        };
      });
      return res.json({ recommendations: coldRecs, tierInfo, coldStart: true });
    }

    // Aggregate product stats from history
    const productStats = {};
    orders.forEach(order => {
      order.OrderItems.forEach(item => {
        if (!item.Product) return; // product may have been deleted
        const pid = item.product_id;
        if (!productStats[pid]) {
          productStats[pid] = {
            productId: pid,
            product: item.Product,
            totalQuantity: 0,
            totalSpent: 0,
            orderCount: 0,
            lastOrdered: order.createdAt
          };
        }
        productStats[pid].totalQuantity += item.quantity;
        productStats[pid].totalSpent += parseFloat(item.subtotal);
        productStats[pid].orderCount += 1;
        if (new Date(order.createdAt) > new Date(productStats[pid].lastOrdered)) {
          productStats[pid].lastOrdered = order.createdAt;
        }
      });
    });

    // Fetch 7-day velocity for each product (in parallel, capped at 8 products for speed)
    const topStats = Object.values(productStats)
      .filter(s => s.product.is_active && s.product.current_stock >= 0)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 8);

    const velocities = await Promise.all(
      topStats.map(s => aiService.calculateSalesVelocity(s.productId, 14))
    );

    const recommendations = topStats
      .map((stat, idx) => {
        const product = stat.product;
        const basePrice = parseFloat(product[priceKey]);
        const discountedPrice = parseFloat((basePrice * discountMultiplier).toFixed(2));
        const avgQty = stat.totalQuantity / stat.orderCount;
        const velocity = velocities[idx] || 0;
        // Recommend 2-week supply based on velocity, floor at historical average × 1.2
        const supplyQty = velocity > 0 ? Math.ceil(velocity * 14) : Math.ceil(avgQty * 1.2);
        const recommendedQuantity = Math.max(supplyQty, 1);
        const savingsPerUnit = basePrice - discountedPrice;
        const totalSavings = savingsPerUnit * recommendedQuantity;
        const stockUrgency = product.current_stock === 0 ? 'out_of_stock'
          : product.current_stock <= (product.reorder_point || 10) ? 'low' : 'normal';

        // Confidence: more history + velocity data = higher confidence
        const baseConfidence = Math.min(65 + stat.orderCount * 4, 90);
        const velocityBoost = velocity > 0 ? 5 : 0;
        const confidence = Math.min(baseConfidence + velocityBoost, 97);

        let reasoning = '';
        if (stockUrgency === 'out_of_stock') {
          reasoning = `Currently out of stock — we'll notify you when restocked. Consider a similar alternative.`;
        } else if (stockUrgency === 'low') {
          reasoning = `Low stock (${product.current_stock} left)! You've ordered this ${stat.orderCount}× — order now before it sells out.`;
          if (tierInfo.discountPercent > 0) reasoning += ` ${tierInfo.tierEmoji} ${tierInfo.discountPercent}% loyalty discount saves you KES ${Math.round(totalSavings)}.`;
        } else if (tierInfo.discountPercent > 0) {
          reasoning = `${tierInfo.tierEmoji} ${tierInfo.tier} loyalty: ${tierInfo.discountPercent}% off. You've ordered this ${stat.orderCount}× (avg ${Math.round(avgQty)} units). Stocking ${recommendedQuantity} covers ~2 weeks demand and saves you KES ${Math.round(totalSavings)}.`;
        } else {
          reasoning = `You've ordered this ${stat.orderCount}× (avg ${Math.round(avgQty)} units/order). Complete ${tierInfo.ordersToNextTier} more order(s) to unlock Bronze loyalty discount!`;
        }

        return {
          productId: stat.productId,
          productName: product.name,
          productImage: product.image_url,
          currentStock: product.current_stock,
          stockUrgency,
          basePrice,
          discountedPrice,
          discountPercent: tierInfo.discountPercent,
          recommendedQuantity,
          totalCost: parseFloat((discountedPrice * recommendedQuantity).toFixed(2)),
          totalSavings: parseFloat(totalSavings.toFixed(2)),
          pastOrderCount: stat.orderCount,
          avgQuantityPerOrder: Math.round(avgQty),
          weeklyVelocity: parseFloat((velocity * 7).toFixed(1)),
          lastOrdered: stat.lastOrdered,
          reasoning,
          confidence
        };
      })
      // Put in-stock items first; within same urgency sort by order frequency
      .sort((a, b) => {
        const urgencyOrder = { normal: 0, low: 1, out_of_stock: 2 };
        if (urgencyOrder[a.stockUrgency] !== urgencyOrder[b.stockUrgency]) {
          return urgencyOrder[a.stockUrgency] - urgencyOrder[b.stockUrgency];
        }
        return b.pastOrderCount - a.pastOrderCount;
      })
      .slice(0, 6);

    res.json({ recommendations, tierInfo });
  } catch (error) {
    console.error('Bulk optimize error:', error);
    res.status(500).json({ message: error.message });
  }
};

// -------------------- 3. AI CHAT --------------------
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
        where: { user_id: userId, payment_status: { [Op.in]: PAID_STATUSES } },
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [{ model: OrderItem, include: [Product] }]
      });

      customerAnalytics = await aiService.analyzeCustomerPatterns(userId);
    }

    let response = '';
    let quickReplies = [];
    const lowerMessage = message.toLowerCase();
    const has = (...terms) => terms.some(t => lowerMessage.includes(t));

    if (!userId) {
      // ----- Guest chat logic (full) -----
      if (lowerMessage.includes('analytics') || lowerMessage.includes('insight')) {
        const platformData = await aiService.getPlatformAnalytics();
        const { summary } = platformData || {};
        response = `📊 Platform Analytics:\n\n• Active Users: ${summary?.activeUsers || 0}\n• Total Orders (30 days): ${summary?.totalOrders || 0}\n• Total Revenue: ${formatCurrency(summary?.totalRevenue || 0)}\n• Avg Order Value: ${formatCurrency(summary?.avgOrderValue || 0)}\n\nSign up for personalized insights!`;
      } else if (has('how', 'work', 'what is bestlady', 'about')) {
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

    // ----- Authenticated user chat logic -----
    if (has('analytics', 'my stats', 'my spend', 'spending', 'how much have i')) {
      if (customerAnalytics) {
        response = `Your Business Analytics:\n\nSpending:\n• Total Spent: ${formatCurrency(customerAnalytics.totalSpent)}\n• Avg Order: ${formatCurrency(customerAnalytics.avgOrderValue)}\n• Orders: ${customerAnalytics.totalOrders}\n\nActivity:\n• Purchases/month: ${customerAnalytics.purchaseFrequency}\n• Preferred payment: ${customerAnalytics.preferredPayment || 'N/A'}\n\nTop Categories:\n`;
        customerAnalytics.topCategories.slice(0, 3).forEach((c, i) => {
          response += `${i + 1}. ${c.name}: ${formatCurrency(c.spent)}\n`;
        });
      } else {
        response = "No order history found yet. Place your first order to start seeing analytics!";
      }
      quickReplies = ['Bulk Optimizer', 'My Discount Tier'];

    } else if (has('order history', 'my orders', 'past orders', 'purchase history', 'all orders') ||
               (has('order', 'purchase') && has('list', 'all', 'history', 'show'))) {
      if (recentOrders.length > 0) {
        response = `Your Recent Orders:\n\n`;
        recentOrders.forEach((o, i) => {
          response += `${i + 1}. #${o.order_number} — ${o.status.toUpperCase()} — ${formatCurrency(o.total_amount)}\n   ${new Date(o.createdAt).toLocaleDateString('en-KE')}\n`;
        });
        response += `\nTotal Spent: ${formatCurrency(customerAnalytics?.totalSpent || 0)}\nSee full history in the Orders section.`;
      } else {
        response = "You don't have any orders yet. Browse our product catalog to place your first order!";
      }
      quickReplies = ['Browse Products', 'Bulk Optimizer'];

    } else if (has('order status', 'track', 'where is my order', 'delivery status', 'shipped')) {
      if (recentOrders.length > 0) {
        const o = recentOrders[0];
        const statusMap = { pending: 'Pending payment', paid: 'Paid — being processed', processing: 'Being prepared', dispatched: 'Out for delivery', delivered: 'Delivered', cancelled: 'Cancelled', completed: 'Completed' };
        response = `Latest Order: #${o.order_number}\n\nStatus: ${statusMap[o.status] || o.status}\nPayment: ${o.payment_status.toUpperCase()}\nAmount: ${formatCurrency(o.total_amount)}\nDate: ${new Date(o.createdAt).toLocaleString('en-KE')}\nDelivery: ${o.delivery_channel === 'pickup' ? 'Pickup Station' : 'Private Rider'}`;
        if (recentOrders.length > 1) response += `\n\nYou have ${recentOrders.length - 1} other recent order(s). Say "my orders" to see them all.`;
      } else {
        response = "You don't have any orders yet. Would you like to browse our products?";
      }
      quickReplies = ['Order History', 'Browse Products'];

    } else if (has('discount', 'loyalty', 'tier', 'reward', 'points', 'bronze', 'silver', 'gold', 'platinum')) {
      const tierInfo = await aiService.getUserDiscountTier(userId);
      response = `Your Loyalty Tier: ${tierInfo.tierEmoji} ${tierInfo.tier}\n\n`;
      if (tierInfo.discountPercent > 0) {
        response += `You earn a ${tierInfo.discountPercent}% discount on all bulk orders!\nCompleted orders: ${tierInfo.completedOrders}\n\n`;
      } else {
        response += `No discount yet. Complete ${tierInfo.ordersToNextTier} more order(s) to unlock Bronze (5% off)!\n\n`;
      }
      if (tierInfo.nextTier) {
        response += `Next tier: ${tierInfo.nextTier} — ${tierInfo.ordersToNextTier} order(s) away\n\n`;
      }
      response += `Tier Breakdown:\nNew (0 orders) → Bronze (3, 5% off) → Silver (10, 8% off) → Gold (25, 12% off) → Platinum (50, 15% off)`;
      quickReplies = ['Bulk Optimizer', 'My Orders'];

    } else if (has('recommend', 'suggestion', 'what should i buy', 'what to order', 'what do you suggest')) {
      const boughtIds = recentOrders.flatMap(o => o.OrderItems.map(i => i.product_id));
      const uniqueBought = [...new Set(boughtIds)];
      const tierInfo = await aiService.getUserDiscountTier(userId);
      const priceKey = userContext.tier === 'wholesale' ? 'wholesale_price' : 'retail_price';
      const discountMultiplier = 1 - tierInfo.discountPercent / 100;

      const suggestions = await Product.findAll({
        where: {
          is_active: true,
          current_stock: { [Op.gt]: 0 },
          ...(uniqueBought.length ? { id: { [Op.notIn]: uniqueBought } } : {})
        },
        limit: 4,
        order: [['createdAt', 'DESC']]
      });
      const list = suggestions.length ? suggestions : await Product.findAll({ where: { is_active: true, current_stock: { [Op.gt]: 0 } }, limit: 4 });

      response = `Personalised picks for you (${userContext.tier} tier):\n\n`;
      list.forEach((p, i) => {
        const base = parseFloat(p[priceKey]);
        const discounted = base * discountMultiplier;
        response += `${i + 1}. ${p.name}\n   Price: ${formatCurrency(base)}`;
        if (tierInfo.discountPercent > 0) response += ` → ${formatCurrency(discounted)} (${tierInfo.discountPercent}% off)`;
        response += `   Stock: ${p.current_stock} units\n\n`;
      });
      response += tierInfo.discountPercent > 0
        ? `${tierInfo.tierEmoji} Your ${tierInfo.tier} loyalty discount applies automatically in Bulk Optimizer!`
        : `Complete ${tierInfo.ordersToNextTier} more orders to unlock loyalty discounts!`;
      quickReplies = ['My Discount Tier', 'Bulk Optimizer'];

    } else if (has('wallet', 'balance', 'top up', 'topup', 'add money', 'deposit')) {
      response = `Wallet Balance: ${formatCurrency(userContext.wallet_balance)}\n\n`;
      response += parseFloat(userContext.wallet_balance) < 1000
        ? 'Your balance is low. Go to Wallet in your dashboard to top up via M-Pesa.'
        : 'Your wallet is funded and ready for purchases!';
      quickReplies = ['Top Up Wallet', 'My Orders'];

    } else if (has('best seller', 'popular', 'trending', 'top product', 'most bought', 'what sells')) {
      const bestSellers = await OrderItem.findAll({
        attributes: ['product_id', [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold']],
        include: [{ model: Product, attributes: ['name', 'retail_price', 'image_url'], where: { is_active: true } }],
        group: ['product_id', 'Product.id'],
        order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
        limit: 5
      });
      if (bestSellers.length > 0) {
        response = 'Trending Products on BestLady:\n\n';
        bestSellers.forEach((item, i) => {
          response += `${i + 1}. ${item.Product.name} — ${formatCurrency(item.Product.retail_price)}   (${item.dataValues.totalSold} units sold)\n`;
        });
      } else {
        response = 'No sales data yet. Browse our catalog to see all available products!';
      }
      quickReplies = ['Bulk Optimizer', 'Recommendations'];

    } else if (has('stock', 'inventory', 'low stock', 'running out', 'restock')) {
      const lowStock = await Product.findAll({
        where: { is_active: true, current_stock: { [Op.lte]: sequelize.col('reorder_point') } },
        limit: 5
      });
      if (lowStock.length > 0) {
        response = 'Low Stock Alert:\n\n';
        lowStock.forEach((p, i) => {
          response += `${i + 1}. ${p.name}\n   Current: ${p.current_stock} units | Reorder at: ${p.reorder_point}\n`;
        });
        response += '\nConsider restocking before these sell out!';
      } else {
        response = 'All inventory levels are healthy. No low stock alerts right now.';
      }
      quickReplies = ['Bulk Optimizer', 'Order History'];

    } else if (has('search', 'find product', 'find item', 'looking for', 'do you have', 'price of', 'cost of', 'how much is', 'how much does')) {
      // Extract likely product search term by stripping known filler words
      const stopWords = ['search', 'find', 'product', 'item', 'looking', 'for', 'do', 'you', 'have', 'price', 'of', 'cost', 'how', 'much', 'is', 'does', 'a', 'the', 'me', 'i', 'want'];
      const searchTerms = lowerMessage.split(/\s+/).filter(w => !stopWords.includes(w) && w.length > 2).join(' ');
      const priceKey = userContext.tier === 'wholesale' ? 'wholesale_price' : 'retail_price';

      const found = searchTerms.length > 1 ? await Product.findAll({
        where: {
          is_active: true,
          [Op.or]: [
            { name: { [Op.iLike]: `%${searchTerms}%` } },
            { description: { [Op.iLike]: `%${searchTerms}%` } },
            { category: { [Op.iLike]: `%${searchTerms}%` } }
          ]
        },
        limit: 5
      }) : [];

      if (found.length > 0) {
        response = `Found ${found.length} product(s) matching "${searchTerms}":\n\n`;
        found.forEach((p, i) => {
          response += `${i + 1}. ${p.name}\n   Price: ${formatCurrency(parseFloat(p[priceKey]))}   Stock: ${p.current_stock} units\n   Category: ${p.category || 'General'}\n\n`;
        });
      } else {
        response = `No products found matching "${searchTerms || message}". Try browsing the catalog for the full product list, or ask me about popular or trending products!`;
      }
      quickReplies = ['Trending Products', 'Recommendations'];

    } else if (has('deliver', 'shipping', 'how long', 'when will', 'arrive', 'pickup')) {
      response = `Delivery Options:\n\n1. Pickup Station (FREE)\n   Pick up your order from your nearest BestLady pickup point. You'll receive an OTP code to collect it.\n\n2. Private Rider (KES 250)\n   Door-to-door delivery to your address. You'll track it in real time.\n\nDelivery time: 1–3 business days after payment confirmation.\nSame-day delivery is available in select Nairobi areas for orders placed before 12PM.`;
      quickReplies = ['Track My Order', 'My Orders'];

    } else if (has('return', 'refund', 'cancel', 'wrong item', 'damaged')) {
      response = `Returns & Refunds:\n\nYou can cancel an order before it is dispatched directly from the Orders page.\n\nFor returns after delivery:\n• Contact us within 48 hours of receiving the order\n• Items must be unused and in original packaging\n• Refunds are processed back to your BestLady wallet within 24 hours\n\nEmail: info@bestlady.co.ke`;
      quickReplies = ['My Orders', 'Contact Support'];

    } else if (has('payment', 'how to pay', 'mpesa', 'stk', 'pay with', 'payment method')) {
      response = `Payment Methods:\n\n1. M-Pesa — Enter your phone number at checkout. You'll receive an STK push to enter your PIN.\n\n2. BestLady Wallet — Pre-load your wallet balance and pay instantly at checkout.\n\nYour current wallet balance: ${formatCurrency(userContext.wallet_balance)}\n\nAll payments are secured and confirmed in real time.`;
      quickReplies = ['Top Up Wallet', 'My Orders'];

    } else if (has('help', 'what can you do', 'assist', 'support')) {
      const tierInfo = await aiService.getUserDiscountTier(userId);
      response = `Hi ${userContext.business_name || userContext.username}! Here's what I can help with:\n\n${tierInfo.tierEmoji} Loyalty: ${tierInfo.tier} (${tierInfo.discountPercent > 0 ? tierInfo.discountPercent + '% discount active' : tierInfo.ordersToNextTier + ' orders to Bronze'})\n\nOrders: status, history, tracking\nWallet: balance, top up\nAnalytics: spending, stats\nProducts: search, recommendations, trending, low stock\nLoyalty: discount tier, rewards\nDelivery: options, times\nPayments: M-Pesa, Wallet\nReturns: cancellation, refunds\n\nWhat would you like to know?`;

    } else {
      // Fuzzy fallback — try a product search on the raw message before giving up
      const priceKey = userContext.tier === 'wholesale' ? 'wholesale_price' : 'retail_price';
      const fallbackProducts = message.length > 3 ? await Product.findAll({
        where: {
          is_active: true,
          [Op.or]: [
            { name: { [Op.iLike]: `%${message.trim()}%` } },
            { category: { [Op.iLike]: `%${message.trim()}%` } }
          ]
        },
        limit: 3
      }) : [];

      if (fallbackProducts.length > 0) {
        response = `Here are products matching "${message}":\n\n`;
        fallbackProducts.forEach((p, i) => {
          response += `${i + 1}. ${p.name} — ${formatCurrency(parseFloat(p[priceKey]))}   Stock: ${p.current_stock}\n`;
        });
        quickReplies = ['Recommendations', 'Bulk Optimizer'];
      } else {
        response = `Hi ${userContext.business_name || userContext.username}! I didn't quite catch that.\n\nTry asking me:\n• "My order status" / "My order history"\n• "My wallet balance" / "Top up wallet"\n• "My analytics" / "My spending"\n• "Best sellers" / "Trending products"\n• "My discount tier" / "Loyalty rewards"\n• "Search [product name]" / "Price of [item]"\n• "Delivery options" / "How to pay"\n• "Returns policy"\n\nHow can I help?`;
        quickReplies = ['My Orders', 'Recommendations', 'My Discount Tier'];
      }
    }

    res.json({ response, quickReplies });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ response: "I'm sorry, I encountered an error. Please try again or contact support if the issue persists." });
  }
};

// -------------------- 4. ADMIN FORECAST --------------------
const getAdminForecast = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const orders = await Order.findAll({
      where: {
        payment_status: { [Op.in]: PAID_STATUSES },
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

    const topProducts = await Order.findAll({
      attributes: [
        'id',
        [sequelize.literal(`(SELECT SUM(quantity) FROM "OrderItems" WHERE "OrderItems"."order_id" = "Order"."id")`), 'totalSold']
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

const refreshInsights = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Fetch user's most frequently bought products (all paid statuses)
    const topItems = await OrderItem.findAll({
      include: [
        {
          model: Order,
          where: { user_id: userId, payment_status: { [Op.in]: PAID_STATUSES } },
          attributes: []
        },
        { model: Product }
      ],
      attributes: [
        'product_id',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQty']
      ],
      group: ['product_id', 'Product.id'],
      order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
      limit: 2
    });

    if (topItems.length === 0) {
      return res.json({
        recommendation: "Welcome to BestLady! Based on current trends in Nairobi, 'Natural Glow Kits' are selling fast.",
        suggestion: null
      });
    }

    const mainProduct = topItems[0].Product;
    const suggestedQty = 5;
    const savingsPercent = 15;

    res.json({
      recommendation: `We noticed you frequently buy ${mainProduct.name}. Demand for this is high!`,
      suggestion: {
        description: `Bundle & Save: Add ${suggestedQty} units of ${mainProduct.name} to your cart for a ${savingsPercent}% bulk discount!`,
        savingsPercent,
        items: [
          {
            product: mainProduct,
            quantity: suggestedQty,
            discountedPrice: req.user.tier === 'wholesale' ? mainProduct.wholesale_price * 0.85 : mainProduct.retail_price * 0.85
          }
        ]
      }
    });
  } catch (error) {
    console.error('Refresh insights error:', error);
    res.status(500).json({ message: 'Error refreshing AI insights' });
  }
};

module.exports = {
  getUserDashboardData,
  bulkOptimize,
  aiChat,
  getAdminForecast,
  refreshInsights
};
