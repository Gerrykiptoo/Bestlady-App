'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Order, { foreignKey: 'user_id' });
      User.hasMany(models.WalletTransaction, { foreignKey: 'user_id' });
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    business_name: DataTypes.STRING,
    business_type: DataTypes.STRING,
    tier: DataTypes.STRING,
    kyc_status: DataTypes.STRING,
    credit_limit: DataTypes.DECIMAL,
    wallet_balance: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};