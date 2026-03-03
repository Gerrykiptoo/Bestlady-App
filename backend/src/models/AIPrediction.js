const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AIPrediction extends Model {
    static associate(models) {
      AIPrediction.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
  }
  AIPrediction.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    prediction_type: { type: DataTypes.ENUM('restock', 'demand'), allowNull: false },
    predicted_value: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    confidence: { type: DataTypes.FLOAT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { sequelize, modelName: 'AIPrediction', timestamps: false });
  return AIPrediction;
};
