'use strict';
const bcrypt = require('bcryptjs');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync('Aa@123456', salt);
    const users = [];
    for (let i = 0; i < 100; i++) {
      users.push({
        id: undefined,
        fullName: `User #${i}`,
        email: `nguyen.thu.duc.trung+${i}@gmail.com`,
        password,
        verificationAt: (Math.floor(Math.random() * 10) + 1) % 2 === 0 ? new Date() : undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
  },
};
