const db = require('./models');

async function inspectDatabase() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected');

    const models = ['User', 'Category', 'Product', 'Order', 'OrderItem', 'WalletTransaction', 'AIPrediction', 'InventoryAlert', 'UserInventory'];
    
    for (const modelName of models) {
      if (db[modelName]) {
        const records = await db[modelName].findAll({ limit: 2 });
        console.log(`\n--- ${modelName} (Showing up to 2 records) ---`);
        if (records.length === 0) {
          console.log('No records found');
        } else {
          records.forEach(r => console.log(JSON.stringify(r.toJSON(), null, 2)));
        }
      }
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error inspecting database:', error);
    process.exit(1);
  }
}

inspectDatabase();
