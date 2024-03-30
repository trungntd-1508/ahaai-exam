'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100), allowNull: false, unique: true,
      },
      password: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      fullName: {
        type: Sequelize.STRING(100), allowNull: true,
      },
      verificationOtp: {
        type: Sequelize.STRING(20), allowNull: true, unique: true,
      },
      verificationAt: {
        type: Sequelize.DATE, allowNull: true,
      },
      googleUserId: {
        type: Sequelize.STRING(50), allowNull: true, unique: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    }, {
      charset: 'utf8mb4',
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('users');
  },
};
