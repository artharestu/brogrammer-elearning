'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require('../data/Courses.json').map(e => {
      return {
        name: e.name,
        description: e.description,
        urlVideo: e.urlVideo,
        statusActive: e.statusActive,
        price: e.price,
        CategoryId: e.CategoryId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    await queryInterface.bulkInsert('Courses', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Courses', null, {});
  }
};
