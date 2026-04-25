'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PickupStation extends Model {
    static associate(models) {
      PickupStation.hasMany(models.Order, { foreignKey: 'pickup_station_id' });
    }
  }

  PickupStation.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true
    },
    lng: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'PickupStation',
    tableName: 'PickupStations',
    timestamps: true
  });

  return PickupStation;
};
