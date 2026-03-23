'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_number: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.STRING
      },
      order_type: {
        type: Sequelize.STRING
      },
      subtotal: {
        type: Sequelize.DECIMAL
      },
      tax: {
        type: Sequelize.DECIMAL
      },
      delivery_fee: {
        type: Sequelize.DECIMAL
      },
      total_amount: {
        type: Sequelize.DECIMAL
      },
      payment_method: {
        type: Sequelize.STRING
      },
      payment_status: {
        type: Sequelize.STRING
      },
      mpesa_code: {
        type: Sequelize.STRING
      },
      delivery_channel: {
        type: Sequelize.STRING
      },
      qr_code: {
        type: Sequelize.STRING
      },
      otp_code: {
        type: Sequelize.STRING
      },
      otp_secret: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};