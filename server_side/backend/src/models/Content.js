'use strict';

module.exports = (sequelize, DataTypes) => {
  const Content = sequelize.define('Content', {
    type: {
      type: DataTypes.ENUM('blog', 'faq', 'shipping_info', 'return_policy', 'track_orders'),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    author_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'Contents',
    timestamps: true
  });

  Content.associate = (models) => {
    Content.belongsTo(models.User, { foreignKey: 'author_id', as: 'Author' });
  };

  return Content;
};
