'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WalletTransaction extends Model {
    static associate(models) {
      WalletTransaction.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  WalletTransaction.init({
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
    transaction_type: {
      type: DataTypes.ENUM('deposit', 'payment', 'refund', 'withdrawal'),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 }
    },
    reference_id: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Order ID or external reference'
    },
    mpesa_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'WalletTransaction',
    tableName: 'WalletTransactions',
    timestamps: true                 // adds createdAt & updatedAt
  });

  return WalletTransaction;
};