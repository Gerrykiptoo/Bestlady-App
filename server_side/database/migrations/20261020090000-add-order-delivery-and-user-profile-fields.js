'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'delivery_address', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Orders', 'delivery_lat', {
      type: Sequelize.DECIMAL(10, 7),
      allowNull: true
    });

    await queryInterface.addColumn('Orders', 'delivery_lng', {
      type: Sequelize.DECIMAL(10, 7),
      allowNull: true
    });

    await queryInterface.addColumn('Orders', 'pickup_station_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'PickupStations',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('Users', 'nickname', {
      type: Sequelize.STRING(100),
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'nickname');
    await queryInterface.removeColumn('Orders', 'pickup_station_id');
    await queryInterface.removeColumn('Orders', 'delivery_lng');
    await queryInterface.removeColumn('Orders', 'delivery_lat');
    await queryInterface.removeColumn('Orders', 'delivery_address');
  }
};
