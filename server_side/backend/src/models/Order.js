'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'user_id' });
      Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });
    }
  }

  Order.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    order_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM(
        'pending', 'paid', 'processing', 'ready',
        'dispatched', 'delivered', 'cancelled'
      ),
      defaultValue: 'pending',
      allowNull: false
    },
    order_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 }
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: { min: 0 }
    },
    delivery_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: { min: 0 }
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 }
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    payment_status: {
      type: DataTypes.STRING(50),
      defaultValue: 'pending'
    },
    mpesa_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    delivery_channel: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    qr_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    otp_code: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    otp_secret: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',          // explicit plural
    timestamps: true               // adds createdAt & updatedAt
  });

  return Order;
};