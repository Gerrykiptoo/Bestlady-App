'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: 'category_id' });
      Product.hasMany(models.OrderItem, { foreignKey: 'product_id' });
      Product.hasMany(models.InventoryAlert, { foreignKey: 'product_id' });
      Product.hasMany(models.AIPrediction, { foreignKey: 'product_id' });
    }
  }

  Product.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category_id: {                       // Foreign key field (required for belongsTo)
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Categories',              // must match the table name of Category
        key: 'id'
      }
    },
    retail_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 }
    },
    wholesale_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 }
    },
    unit: {
      type: DataTypes.STRING,
      defaultValue: 'piece'
    },
    min_stock_level: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      validate: { min: 0 }
    },
    current_stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 }
    },
    reorder_point: {
      type: DataTypes.INTEGER,
      defaultValue: 20,
      validate: { min: 0 }
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',                // explicit plural
    timestamps: true                       // adds createdAt & updatedAt
  });

  return Product;
};