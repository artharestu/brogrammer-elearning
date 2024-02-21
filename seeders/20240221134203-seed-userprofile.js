"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/UserProfiles.json").map((e) => {
      return {
        fullName: e.fullName,
        profilePicture: e.profilePicture,
        dateOfBirth: e.dateOfBirth,
        UserId: e.UserId,
        phoneNumber: e.phoneNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("UserProfiles", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserProfiles", null, {});
  },
};
