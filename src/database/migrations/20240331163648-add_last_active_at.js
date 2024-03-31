'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('users', 'lastActiveAt', {
      type: Sequelize.DATE, allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('users', 'lastLoginAt', {
      type: Sequelize.DATE, allowNull: true,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('users', 'lastActiveAt', { transaction }),
    queryInterface.removeColumn('users', 'lastLoginAt', { transaction }),
  ])),
};
