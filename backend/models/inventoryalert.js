'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InventoryAlert extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      InventoryAlert.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
  }
  InventoryAlert.init({
    alert_type: DataTypes.STRING,
    message: DataTypes.TEXT,
    is_resolved: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'InventoryAlert',
  });
  return InventoryAlert;
};