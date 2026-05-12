const { Order, OrderItem, Product, sequelize } = require('../models');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');

/**
 * Generate financial report (orders, products sold, stock)
 * @route GET /api/admin/reports/financial
 * @query reportType, startDate, endDate
 */
exports.generateFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate, reportType } = req.query;
    const whereDate = {};

    if (startDate && endDate && reportType !== 'stock') {
      whereDate.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    let data = [];
    let fields = [];
    let filename = '';

    switch (reportType) {
      case 'orders':
        data = await Order.findAll({
          where: { ...whereDate, payment_status: 'completed' },
          include: [{ model: OrderItem, include: [Product] }],
          order: [['createdAt', 'DESC']]
        });
        // Flatten order data for CSV
        data = data.map(order => ({
          order_number: order.order_number,
          createdAt: order.createdAt,
          total_amount: order.total_amount,
          status: order.status,
          user_id: order.user_id,
          payment_method: order.payment_method
        }));
        fields = ['order_number', 'createdAt', 'total_amount', 'status', 'user_id', 'payment_method'];
        filename = `orders_${startDate || 'all'}_to_${endDate || 'now'}.csv`;
        break;

      case 'products_sold':
        const productSales = await OrderItem.findAll({
          attributes: [
            'product_id',
            [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'],
            [sequelize.fn('SUM', sequelize.col('subtotal')), 'total_revenue']
          ],
          include: [{ model: Product, attributes: ['name', 'sku', 'retail_price'] }],
          where: whereDate,
          group: ['product_id', 'Product.id']
        });
        data = productSales.map(item => ({
          product_name: item.Product.name,
          sku: item.Product.sku,
          total_quantity: item.dataValues.total_quantity,
          total_revenue: item.dataValues.total_revenue,
          avg_price: (item.dataValues.total_revenue / item.dataValues.total_quantity)?.toFixed(2) || 0
        }));
        fields = ['product_name', 'sku', 'total_quantity', 'total_revenue', 'avg_price'];
        filename = `products_sold_${startDate || 'all'}.csv`;
        break;

      case 'stock':
        const products = await Product.findAll({
          attributes: ['name', 'sku', 'current_stock', 'reorder_point', 'retail_price', 'wholesale_price']
        });
        data = products.map(p => p.toJSON());
        fields = ['name', 'sku', 'current_stock', 'reorder_point', 'retail_price', 'wholesale_price'];
        filename = `stock_levels_${new Date().toISOString().slice(0,10)}.csv`;
        break;

      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    res.send(csv);
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ message: 'Failed to generate report', error: error.message });
  }
};