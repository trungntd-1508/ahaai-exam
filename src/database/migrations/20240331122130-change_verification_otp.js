'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('users', 'verificationCode', {
      type: Sequelize.STRING(50), allowNull: true,
    }, { transaction }),
    queryInterface.removeColumn('users', 'verificationOtp', { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('users', 'verificationCode', { transaction }),
    queryInterface.addColumn('users', 'verificationOtp', {
      type: Sequelize.STRING(20), allowNull: true,
    }, { transaction }),
  ])),
};
