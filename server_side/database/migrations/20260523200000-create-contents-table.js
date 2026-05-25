'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Contents', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('blog', 'faq', 'shipping_info', 'return_policy', 'track_orders'),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: ''
      },
      author_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      is_published: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Contents');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Contents_type";');
  }
};
