'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SavedItem extends Model {
    static associate(models) {
      SavedItem.belongsTo(models.User, { foreignKey: 'user_id' });
      SavedItem.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
  }

  SavedItem.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' }
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Products', key: 'id' }
    },
    // Snapshot fields so the saved list renders even if product data shifts
    name: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    discountedPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    discountPercent: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    image_url: { type: DataTypes.TEXT, allowNull: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
  }, {
    sequelize,
    modelName: 'SavedItem',
    tableName: 'SavedItems',
    indexes: [{ unique: true, fields: ['user_id', 'product_id'] }]
  });

  return SavedItem;
};
