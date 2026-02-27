const Queue = require('bull');
const { Product, InventoryAlert } = require('../models');
const { predictRestock } = require('../services/aiService');
const redisConfig = require('../config/redis');

// Create a Bull queue for inventory tasks
const inventoryQueue = new Queue('inventory', {
  redis: {
    host: redisConfig.options?.host || '127.0.0.1',
    port: redisConfig.options?.port || 6379,
  },
});

// Process jobs in the queue
inventoryQueue.process(async (job) => {
  const { task } = job.data;

  switch (task) {
    case 'updateAllPredictions':
      await updateAllRestockPredictions();
      break;
    case 'checkLowStock':
      await checkLowStockAlerts();
      break;
    default:
      console.warn(`Unknown task: ${task}`);
  }
});

/**
 * Update restock predictions for all active products
 */
async function updateAllRestockPredictions() {
  console.log('Starting restock predictions update...');
  const products = await Product.findAll({ where: { is_active: true } });

  for (const product of products) {
    try {
      const prediction = await predictRestock(product);
      // Optionally save the prediction to AIPrediction model
      // (already done in aiService or you can add logic here)
      console.log(`Prediction for ${product.name}:`, prediction);
    } catch (error) {
      console.error(`Failed to predict for product ${product.id}:`, error);
    }
  }
  console.log('Restock predictions update completed.');
}

/**
 * Check for low stock and create alerts if needed
 */
async function checkLowStockAlerts() {
  console.log('Checking low stock alerts...');
  const products = await Product.findAll({
    where: {
      is_active: true,
      current_stock: { [Op.lte]: sequelize.col('reorder_point') },
    },
  });

  for (const product of products) {
    // Check if an unresolved alert already exists
    const existingAlert = await InventoryAlert.findOne({
      where: {
        product_id: product.id,
        alert_type: 'low_stock',
        is_resolved: false,
      },
    });
    if (!existingAlert) {
      await InventoryAlert.create({
        product_id: product.id,
        alert_type: 'low_stock',
        message: `Low stock: only ${product.current_stock} left (reorder at ${product.reorder_point})`,
        is_resolved: false,
      });
      console.log(`Alert created for product ${product.name}`);
    }
  }
  console.log('Low stock check completed.');
}

// Schedule recurring jobs (e.g., every day at 2:00 AM)
inventoryQueue.add(
  { task: 'updateAllPredictions' },
  { repeat: { cron: '0 2 * * *' } } // every day at 02:00
);

inventoryQueue.add(
  { task: 'checkLowStock' },
  { repeat: { cron: '0 */6 * * *' } } // every 6 hours
);

// Optional: Add a one‑time job on startup
// inventoryQueue.add({ task: 'updateAllPredictions' }, { delay: 5000 });

module.exports = inventoryQueue;