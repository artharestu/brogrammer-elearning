'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require('../data/Subscriptions.json').map(e => {
      return {
        UserId: e.UserId,
        CourseId: e.CourseId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    await queryInterface.bulkInsert('Subscriptions', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Subscriptions', null, {});
  }
};
