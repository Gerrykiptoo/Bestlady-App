'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: 'category_id' });
      Product.hasMany(models.OrderItem, { foreignKey: 'product_id' });
      Product.hasMany(models.InventoryAlert, { foreignKey: 'product_id' });
      Product.hasMany(models.AIPrediction, { foreignKey: 'product_id' });
    }
  }
  Product.init({
    sku: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    retail_price: DataTypes.DECIMAL,
    wholesale_price: DataTypes.DECIMAL,
    unit: DataTypes.STRING,
    min_stock_level: DataTypes.INTEGER,
    current_stock: DataTypes.INTEGER,
    reorder_point: DataTypes.INTEGER,
    image_url: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};