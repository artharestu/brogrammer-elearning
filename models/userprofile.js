"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      UserProfile.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  UserProfile.init(
    {
      fullName: DataTypes.STRING,
      profilePicture: DataTypes.TEXT,
      dateOfBirth: DataTypes.DATE,
      UserId: DataTypes.INTEGER,
      phoneNumber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserProfile",
    }
  );
  return UserProfile;
};
