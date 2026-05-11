const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AIPrediction extends Model {
    static associate(models) {
      AIPrediction.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
  }
  AIPrediction.init({
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
    prediction_type: { 
      type: DataTypes.STRING(50), 
      allowNull: false 
    },
    predicted_value: { 
      type: DataTypes.DECIMAL(10,2), 
      allowNull: true 
    },
    confidence: { 
      type: DataTypes.FLOAT 
    },
    // ✅ Use correct column name: createdAt (camelCase) -> maps to "createdAt" in DB
    createdAt: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW,
      field: 'createdAt'      // explicitly map to the database column name
    }
  }, { 
    sequelize, 
    modelName: 'AIPrediction', 
    tableName: 'AIPredictions',
    timestamps: false         // we manage createdAt manually
  });
  return AIPrediction;
};