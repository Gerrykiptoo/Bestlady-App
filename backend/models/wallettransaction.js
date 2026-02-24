'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WalletTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WalletTransaction.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  WalletTransaction.init({
    transaction_type: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    reference_id: DataTypes.STRING,
    mpesa_code: DataTypes.STRING,
    status: DataTypes.STRING,
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'WalletTransaction',
  });
  return WalletTransaction;
};