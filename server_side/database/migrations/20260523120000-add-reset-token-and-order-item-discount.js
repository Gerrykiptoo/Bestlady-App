'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Password reset fields on Users
    await queryInterface.addColumn('Users', 'reset_token', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Users', 'reset_token_expires', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Discount tracking on OrderItems
    await queryInterface.addColumn('OrderItems', 'original_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
    await queryInterface.addColumn('OrderItems', 'discount_percent', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'reset_token');
    await queryInterface.removeColumn('Users', 'reset_token_expires');
    await queryInterface.removeColumn('OrderItems', 'original_price');
    await queryInterface.removeColumn('OrderItems', 'discount_percent');
  }
};
