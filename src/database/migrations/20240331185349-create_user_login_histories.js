'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_login_histories', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER, allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    }, {
      charset: 'utf8mb4',
    }).then(() => {
      return queryInterface.addIndex('user_login_histories', ['userId'])
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('user_login_histories');
  },
};
