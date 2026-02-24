'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AIPrediction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AIPrediction.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
  }
  AIPrediction.init({
    prediction_type: DataTypes.STRING,
    predicted_value: DataTypes.DECIMAL,
    confidence: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'AIPrediction',
  });
  return AIPrediction;
};