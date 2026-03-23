'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class InventoryAlert extends Model {
    static associate(models) {
      InventoryAlert.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
  }

  InventoryAlert.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    alert_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_resolved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'InventoryAlert',
    tableName: 'InventoryAlerts',   // optional explicit plural
    timestamps: true                 // adds createdAt & updatedAt
  });

  return InventoryAlert;
};