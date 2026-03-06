'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserInventory extends Model {
    static associate(models) {
      UserInventory.belongsTo(models.User, { foreignKey: 'user_id' });
      UserInventory.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
  }

  UserInventory.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    current_stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    reorder_point: {
      type: DataTypes.INTEGER,
      defaultValue: 10
    },
    last_ordered: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'UserInventory',
    tableName: 'UserInventory',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'product_id']
      }
    ]
  });

  return UserInventory;
};
