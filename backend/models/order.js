'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'user_id' });
      Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });
    }
  }
  Order.init({
    order_number: DataTypes.STRING,
    status: DataTypes.STRING,
    order_type: DataTypes.STRING,
    subtotal: DataTypes.DECIMAL,
    tax: DataTypes.DECIMAL,
    delivery_fee: DataTypes.DECIMAL,
    total_amount: DataTypes.DECIMAL,
    payment_method: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    mpesa_code: DataTypes.STRING,
    delivery_channel: DataTypes.STRING,
    qr_code: DataTypes.STRING,
    otp_code: DataTypes.STRING,
    otp_secret: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};